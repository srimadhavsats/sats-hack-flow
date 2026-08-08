// Live on-chain lookup for Ethereum — fully client-side, no API key required
// (so it keeps working on a static GitHub Pages deploy).
//
// Primary source: raw JSON-RPC against public endpoints
//   eth_getBalance / eth_getTransactionCount / eth_getCode / eth_blockNumber
//   -> this is the core forensic-triage workflow (reading raw JSON-RPC payloads).
//
// Enrichment: Blockscout v2 public REST API (keyless, CORS-enabled) for entity
//   labels and recent native-ETH transfers. Enrichment is best-effort: if it
//   fails, the JSON-RPC balance/nonce/contract data is still returned.

// Keyless, CORS-enabled public Ethereum RPC endpoints (with failover).
const RPC_ENDPOINTS = [
  'https://ethereum-rpc.publicnode.com',
  'https://eth.drpc.org',
  'https://1rpc.io/eth',
];

const BLOCKSCOUT = 'https://eth.blockscout.com/api/v2';

// Approx ETH price used purely to scale bubble sizes / show a rough USD figure.
// (A production build would pull a live price feed; this keeps the demo keyless.)
const APPROX_ETH_USD = 3000;

export const isValidEvmAddress = (a) => /^0x[a-fA-F0-9]{40}$/.test((a || '').trim());

export const shortAddr = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '');

const weiHexToEth = (hex) => {
  try { return Number(BigInt(hex)) / 1e18; } catch { return 0; }
};
const weiStrToEth = (s) => {
  try { return Number(BigInt(s)) / 1e18; } catch { return 0; }
};

// Raw JSON-RPC call with endpoint failover.
async function rpcCall(method, params) {
  let lastErr;
  for (const url of RPC_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      });
      if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error.message || 'RPC error');
      return json.result;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('All RPC endpoints failed');
}

// Fetch a normalized on-chain profile for an Ethereum address.
export async function fetchAddressProfile(rawAddress) {
  const address = (rawAddress || '').trim().toLowerCase();
  if (!isValidEvmAddress(address)) {
    throw new Error('Enter a valid 0x… 42-character Ethereum address.');
  }

  // --- Raw JSON-RPC (always runs; this is the part that must never fail silently) ---
  const [balHex, nonceHex, code, blockHex] = await Promise.all([
    rpcCall('eth_getBalance', [address, 'latest']),
    rpcCall('eth_getTransactionCount', [address, 'latest']),
    rpcCall('eth_getCode', [address, 'latest']),
    rpcCall('eth_blockNumber', []),
  ]);

  const profile = {
    address,
    ethBalance: weiHexToEth(balHex),
    txCount: parseInt(nonceHex, 16),
    isContract: !!code && code !== '0x',
    latestBlock: parseInt(blockHex, 16),
    label: null,
    tags: [],
    transfers: [],
    enriched: false,
  };

  // --- Blockscout enrichment (best-effort: labels + recent transfers) ---
  try {
    const [meta, txs] = await Promise.all([
      fetch(`${BLOCKSCOUT}/addresses/${address}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${BLOCKSCOUT}/addresses/${address}/transactions`).then((r) => (r.ok ? r.json() : null)),
    ]);

    if (meta) {
      profile.label =
        meta.name || meta.public_tags?.[0]?.display_name || meta.ens_domain_name || null;
      profile.tags = [
        ...(meta.public_tags || []).map((t) => t.display_name),
        ...(meta.private_tags || []).map((t) => t.display_name),
      ].filter(Boolean);
      if (meta.is_contract) profile.isContract = true;
      if (meta.coin_balance) profile.ethBalance = weiStrToEth(meta.coin_balance);
    }

    if (txs?.items?.length) {
      profile.transfers = txs.items.slice(0, 8).map((t) => {
        const from = (t.from?.hash || '').toLowerCase();
        const isOut = from === address;
        const cpObj = isOut ? t.to : t.from;
        return {
          hash: t.hash,
          valueEth: weiStrToEth(t.value || '0'),
          method: t.method || t.tx_types?.[0] || 'transfer',
          timestamp: t.timestamp,
          direction: isOut ? 'out' : 'in',
          counterparty: (cpObj?.hash || '').toLowerCase(),
          counterpartyName: cpObj?.name || cpObj?.ens_domain_name || null,
          counterpartyIsContract: !!cpObj?.is_contract,
        };
      });
      profile.enriched = true;
    }
  } catch {
    // Enrichment is optional — keep the JSON-RPC data we already have.
  }

  return profile;
}

// Light heuristic: classify a counterparty into the graph's existing entity types.
function classifyCounterparty(name, isContract) {
  if (name && /binance|coinbase|okx|kraken|bybit|kucoin|exchange|bitfinex|gate\.io/i.test(name)) {
    return 'cex';
  }
  if (name && /tornado|mixer|railgun|wasabi/i.test(name)) return 'mixer';
  if (name && /bridge|wormhole|thorchain|hop|across|stargate/i.test(name)) return 'bridge';
  return isContract ? 'bridge' : 'hop';
}

// Shape a live profile into the same {nodes, edges, ...} object the graph consumes,
// so the live view reuses BubbleMapGraph + EntityInspector unchanged.
export function buildIncidentFromAddress(profile) {
  const subjectId = 'subject';
  const usd = (eth) => Math.round(Math.max(eth, 0) * APPROX_ETH_USD);

  const nodes = [
    {
      id: subjectId,
      label: `${profile.label || 'Query Subject'}\n${shortAddr(profile.address)}`,
      type: 'victim', // cyan → visually anchors the traced address
      value: Math.max(usd(profile.ethBalance), 1000),
      entity: profile.label || (profile.isContract ? 'Smart Contract' : 'EOA Wallet'),
      chain: 'Ethereum',
      address: profile.address,
    },
  ];

  const edges = [];
  const seen = new Map();

  profile.transfers.forEach((t) => {
    if (!t.counterparty) return;
    let nodeId = seen.get(t.counterparty);
    if (!nodeId) {
      nodeId = `cp_${seen.size}`;
      seen.set(t.counterparty, nodeId);
      nodes.push({
        id: nodeId,
        label: `${t.counterpartyName || (t.counterpartyIsContract ? 'Contract' : 'Wallet')}\n${shortAddr(t.counterparty)}`,
        type: classifyCounterparty(t.counterpartyName, t.counterpartyIsContract),
        value: Math.max(usd(t.valueEth), 1000),
        entity: t.counterpartyName || (t.counterpartyIsContract ? 'Contract' : 'EOA'),
        chain: 'Ethereum',
        address: t.counterparty,
      });
    }
    const [from, to] = t.direction === 'out' ? [subjectId, nodeId] : [nodeId, subjectId];
    edges.push({
      from,
      to,
      label: t.valueEth > 0 ? `${t.valueEth.toFixed(4)} ETH` : t.method,
      value: Math.max(usd(t.valueEth), 1000),
      token: 'ETH',
      txHash: t.hash,
      timestamp: t.timestamp,
    });
  });

  return {
    id: `live_${profile.address}`,
    name: `Live Trace — ${profile.label || shortAddr(profile.address)}`,
    year: new Date().getFullYear(),
    date: new Date().toLocaleString(),
    totalStolen: 0,
    stolenFormatted: `${profile.ethBalance.toFixed(4)} ETH`,
    victim: profile.label || shortAddr(profile.address),
    attackVector: 'Live On-Chain Address Trace',
    chains: ['Ethereum'],
    status: profile.isContract ? 'Smart Contract' : 'EOA Wallet',
    hackerEntity: profile.label || 'Unlabeled Address',
    description: `Live JSON-RPC + Blockscout lookup for ${profile.address}. Balance ${profile.ethBalance.toFixed(4)} ETH across ${profile.txCount} outbound transactions.`,
    nodes,
    edges,
    callTrace: [],
    cieloTimeline: profile.transfers.slice(0, 4).map((t) => ({
      time: t.timestamp || '—',
      event: `${t.direction === 'out' ? 'Outgoing' : 'Incoming'} ${t.valueEth.toFixed(4)} ETH`,
      chain: 'Ethereum',
      detail: `${t.method} ${t.direction === 'out' ? 'to' : 'from'} ${shortAddr(t.counterparty)}`,
    })),
  };
}
