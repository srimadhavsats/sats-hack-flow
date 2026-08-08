// Chronological database of smart contract hacks & exploits (2016 - 2025)
//
// NOTE ON DATA FIDELITY: incident-level facts (amounts, dates, victims, attack
// vectors, attribution, status) are drawn from public post-mortems and are accurate.
// The per-node wallet addresses and tx hashes are ILLUSTRATIVE placeholders for the
// flow-graph, except where a well-published exploiter address is used (e.g. Bybit).
// A production forensic build would source these live from Arkham / Etherscan APIs.

export const INCIDENTS = [
  {
    id: "dao-hack-2016",
    name: "The DAO Hack",
    year: 2016,
    date: "June 17, 2016",
    totalStolen: 60000000,
    stolenFormatted: "$60.0 Million (3.6M ETH)",
    victim: "The DAO Protocol",
    attackVector: "Reentrancy Vulnerability",
    chains: ["Ethereum (Pre-Fork)", "Ethereum Classic"],
    status: "Hard-Forked / Recovered",
    hackerEntity: "The DAO Hacker (0x304a...)",
    description: "The historic DAO hack exploited a recursive calling reentrancy flaw in the splitDAO function before internal account balances were updated, allowing the attacker to drain 3.6 million ETH into a Child DAO.",
    nodes: [
      { id: "dao_vault", label: "The DAO Primary Vault\n0xbb9bc2...4100", type: "victim", value: 3600000, entity: "Victim Vault", chain: "Ethereum", address: "0xbb9bc244d798123fde783fcc1c72d3bb8c189413" },
      { id: "hacker_child_dao", label: "Child DAO (Hacker Vault)\n0x304a55...89e2", type: "hacker", value: 3600000, entity: "Exploiter Vault", chain: "Ethereum", address: "0x304a55b5a4b4376406643da241a23c32607889e2" },
      { id: "hacker_main", label: "Hacker Controller Wallet\n0x9690b6...d6c7", type: "hacker", value: 120000, entity: "Hacker EOA", chain: "Ethereum", address: "0x9690b63a4a56c230773d6d678d7890b200b3d6c7" },
      { id: "dark_dao_split", label: "Dark DAO Withdrawal Hop\n0xf35824...71a1", type: "hop", value: 500000, entity: "Intermediate Hop", chain: "Ethereum Classic", address: "0xf3582498273d671a198086" },
      { id: "poloniex_deposit", label: "Poloniex ETC Deposit\n0x88ad91...012f", type: "cex", value: 150000, entity: "CEX Deposit", chain: "Ethereum Classic", address: "0x88ad91e523f0012f" },
      { id: "shapeshift_hop", label: "ShapeShift Swap Hop\n0x5b3281...99bc", type: "bridge", value: 80000, entity: "Instant Exchange", chain: "Ethereum Classic", address: "0x5b328199bc" }
    ],
    edges: [
      { from: "dao_vault", to: "hacker_child_dao", label: "3,641,694 ETH", value: 3641694, token: "ETH", txHash: "0x9f46b3...d782", timestamp: "2016-06-17 03:30 UTC" },
      { from: "hacker_child_dao", to: "hacker_main", label: "120,000 ETH Split Fee", value: 120000, token: "ETH", txHash: "0x8a92f1...1203", timestamp: "2016-06-17 04:15 UTC" },
      { from: "hacker_child_dao", to: "dark_dao_split", label: "500,000 ETC (Post-Fork)", value: 500000, token: "ETC", txHash: "0x12bc90...881a", timestamp: "2016-07-28 11:20 UTC" },
      { from: "dark_dao_split", to: "poloniex_deposit", label: "150,000 ETC", value: 150000, token: "ETC", txHash: "0x77cc12...ee45", timestamp: "2016-08-01 14:02 UTC" },
      { from: "dark_dao_split", to: "shapeshift_hop", label: "80,000 ETC", value: 80000, token: "ETC", txHash: "0x55aa34...bb99", timestamp: "2016-08-02 09:40 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "TheDAO.sol", function: "splitDAO(uint256 proposalsId, address newCurator)", status: "SUCCESS", value: "0 ETH", note: "Attacker triggers splitDAO with malicious proposal" },
      { step: 2, depth: 1, contract: "DAO_Token.sol", function: "withdrawRewardFor(address account)", status: "SUCCESS", value: "0 ETH", note: "Internal reward calculation triggered" },
      { step: 3, depth: 2, contract: "MaliciousPayee.sol", function: "fallback() / receive()", status: "REENTER", value: "3,641,694 ETH", note: "⚠️ REENTRANCY BUG: Malicious fallback re-invokes splitDAO before balance update!" },
      { step: 4, depth: 3, contract: "TheDAO.sol", function: "splitDAO(...) [Recursive 1...N]", status: "DRAINED", value: "3,641,694 ETH", note: "Vault balance reduced to zero" }
    ],
    cieloTimeline: [
      { time: "2016-06-17 03:28:12 UTC", event: "Large Contract Interaction", chain: "Ethereum", detail: "0x304a55... called TheDAO.splitDAO()" },
      { time: "2016-06-17 03:30:45 UTC", event: "Mass Outflow Alert", chain: "Ethereum", detail: "3.64M ETH transferred to Child DAO #79" },
      { time: "2016-07-20 13:00:00 UTC", event: "Hard Fork State Shift", chain: "Ethereum", detail: "Block 1,920,000 hard fork executed to refund victims" }
    ]
  },
  {
    id: "parity-multisig-2017",
    name: "Parity MultiSig Library Freeze",
    year: 2017,
    date: "November 6, 2017",
    totalStolen: 150000000,
    stolenFormatted: "$150.0 Million (513k ETH Frozen)",
    victim: "Parity Wallet Library",
    attackVector: "Uninitialized Proxy / Ownership Takeover",
    chains: ["Ethereum"],
    status: "Permanently Frozen",
    hackerEntity: "devops199 (Accidental / Malicious)",
    description: "User 'devops199' initialized the shared library contract backing all Parity MultiSig wallets, turned themselves into owner, and then called suicide() / selfdestruct(), permanently freezing 513,774 ETH across 587 multi-sig wallets.",
    nodes: [
      { id: "parity_lib", label: "Parity Wallet Library\n0x863df6...1935", type: "victim", value: 513774, entity: "Library Contract", chain: "Ethereum", address: "0x863df6bfa4469f3ae09b001a26b712613d2f1935" },
      { id: "multisig_wallets", label: "587 Locked Wallet Vaults\n(Gavin Wood / Polkadot / ICOs)", type: "hop", value: 513774, entity: "Affected MultiSigs", chain: "Ethereum", address: "Multiple (587 Contracts)" },
      { id: "devops_account", label: "devops199 EOA\n0xae518f...218a", type: "hacker", value: 0, entity: "Triggering Address", chain: "Ethereum", address: "0xae518f9e61218a" }
    ],
    edges: [
      { from: "devops_account", to: "parity_lib", label: "initWallet() Takeover", value: 0, token: "ETH", txHash: "0x05f5e4...90a1", timestamp: "2017-11-06 14:22 UTC" },
      { from: "devops_account", to: "parity_lib", label: "kill() / selfdestruct()", value: 513774, token: "ETH (Frozen)", txHash: "0x470cd8...77aa", timestamp: "2017-11-06 15:38 UTC" },
      { from: "parity_lib", to: "multisig_wallets", label: "Delegatecall Failure (Frozen)", value: 513774, token: "ETH", txHash: "N/A", timestamp: "Permanent Lock" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "EnhancedWalletLibrary.sol", function: "initWallet(address[] _owners, uint _required, uint _daylimit)", status: "SUCCESS", value: "0 ETH", note: "Library contract lacked constructor protection; initialized by caller" },
      { step: 2, depth: 0, contract: "EnhancedWalletLibrary.sol", function: "kill(address _to)", status: "DESTROYED", value: "0 ETH", note: "⚠️ SELFDESTRUCT: Code erased at 0x863df6... all delegatecall() callers permanently bricked!" }
    ],
    cieloTimeline: [
      { time: "2017-11-06 15:38:22 UTC", event: "Contract Self-Destruct Alert", chain: "Ethereum", detail: "Parity Wallet Library contract killed by 0xae518f..." },
      { time: "2017-11-06 16:05:00 UTC", event: "Global Ecosystem Impact", chain: "Ethereum", detail: "Polkadot ICO ($98M) and 500+ projects locked out of funds" }
    ]
  },
  {
    id: "bzx-flashloan-2020",
    name: "bZx Flash Loan Attack",
    year: 2020,
    date: "February 15, 2020",
    totalStolen: 8000000,
    stolenFormatted: "$8.0 Million (USD / ETH / WBTC)",
    victim: "bZx Fulcrum Protocol",
    attackVector: "Flash Loan & Oracle Price Manipulation",
    chains: ["Ethereum"],
    status: "Partially Loss Covered / Patched",
    hackerEntity: "Arbitrage Exploiter (0xb46c...)",
    description: "One of the pioneer DeFi flash loan hacks. The attacker borrowed 10k ETH from dYdX, pumped Kyber/Uniswap oracle prices for sUSD/WBTC, and exploited bZx's margin trading logic to siphon arbitrage profits.",
    nodes: [
      { id: "dydx_solo", label: "dYdX SoloMargin\n(10,000 ETH FlashLoan)", type: "hop", value: 10000, entity: "FlashLoan Source", chain: "Ethereum", address: "0x1e0ec6767f6941001" },
      { id: "bzx_vault", label: "bZx iVault\n0xb46c62...8901", type: "victim", value: 3500000, entity: "Victim Vault", chain: "Ethereum", address: "0xb46c628901" },
      { id: "uniswap_v1", label: "Uniswap sUSD Pool\n(Manipulated Oracle)", type: "bridge", value: 5000000, entity: "DEX Oracle", chain: "Ethereum", address: "0xf5d91557...22" },
      { id: "hacker_eoa", label: "Attacker EOA\n0xb46c62...0099", type: "hacker", value: 1193, entity: "Exploiter EOA", chain: "Ethereum", address: "0xb46c620099" },
      { id: "tornado_cash", label: "Tornado.Cash 100 ETH Mixer", type: "mixer", value: 1100, entity: "Privacy Mixer", chain: "Ethereum", address: "0x910cbd52...11" }
    ],
    edges: [
      { from: "dydx_solo", to: "bzx_vault", label: "10,000 ETH Flash Loan", value: 10000, token: "ETH", txHash: "0xb5c8bd...1101", timestamp: "2020-02-15 01:22 UTC" },
      { from: "bzx_vault", to: "uniswap_v1", label: "Short WBTC / Pump sUSD", value: 5600, token: "ETH", txHash: "0xb5c8bd...1101", timestamp: "2020-02-15 01:22 UTC" },
      { from: "bzx_vault", to: "hacker_eoa", label: "1,193 ETH Profit", value: 1193, token: "ETH", txHash: "0xb5c8bd...1101", timestamp: "2020-02-15 01:23 UTC" },
      { from: "hacker_eoa", to: "tornado_cash", label: "1,100 ETH Deposited", value: 1100, token: "ETH", txHash: "0xee77ab...8912", timestamp: "2020-02-15 04:10 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "dYdX", function: "flashLoan(10,000 ETH)", status: "SUCCESS", value: "10,000 ETH", note: "Borrowed 10,000 ETH zero-collateral" },
      { step: 2, depth: 1, contract: "Compound", function: "mint() & borrow(112 WBTC)", status: "SUCCESS", value: "5,500 ETH", note: "Collateralized ETH to borrow WBTC" },
      { step: 3, depth: 1, contract: "bZxFulcrum", function: "marginTrade(5x Short WBTC)", status: "SUCCESS", value: "5,600 ETH", note: "Swapped WBTC on Kyber/Uniswap causing massive slippage" },
      { step: 4, depth: 2, contract: "Uniswap", function: "ethToTokenSwap()", status: "MANIPULATED", value: "5,600 ETH", note: "⚠️ Oracle price artificially inflated by 300%" },
      { step: 5, depth: 1, contract: "dYdX", function: "repayFlashLoan()", status: "SUCCESS", value: "10,000 ETH", note: "Net profit ~1,193 ETH" }
    ],
    cieloTimeline: [
      { time: "2020-02-15 01:22:04 UTC", event: "Flash Loan Detection", chain: "Ethereum", detail: "Single transaction executed 5 multi-DEX swaps" },
      { time: "2020-02-15 04:10:15 UTC", event: "Mixer Outflow", chain: "Ethereum", detail: "1,100 ETH deposited into Tornado Cash 100 ETH pool" }
    ]
  },
  {
    id: "poly-network-2021",
    name: "Poly Network Exploit",
    year: 2021,
    date: "August 10, 2021",
    totalStolen: 611000000,
    stolenFormatted: "$611.0 Million (Cross-Chain)",
    victim: "Poly Network Protocol",
    attackVector: "Cross-Chain Privilege Escalation / Hash Collision",
    chains: ["Ethereum", "BNB Chain", "Polygon"],
    status: "100% Funds Returned (Whitehat)",
    hackerEntity: "Mr. White Hat (0x838f...)",
    description: "The largest DeFi exploit at the time. The hacker found a signature hash collision allowing them to call EthCrossChainManager and overwrite the keeper address, granting themselves privilege to unlock all assets across 3 blockchains.",
    nodes: [
      { id: "poly_eth_vault", label: "Poly Manager ETH Vault\n0x250e76...7798", type: "victim", value: 273000000, entity: "Ethereum Lock Vault", chain: "Ethereum", address: "0x250e767798" },
      { id: "poly_bsc_vault", label: "Poly Manager BSC Vault\n0x0b8e72...1109", type: "victim", value: 253000000, entity: "BSC Lock Vault", chain: "BNB Chain", address: "0x0b8e721109" },
      { id: "poly_polygon_vault", label: "Poly Polygon Vault\n0x5a188f...991a", type: "victim", value: 85000000, entity: "Polygon Lock Vault", chain: "Polygon", address: "0x5a188f991a" },
      { id: "hacker_master", label: "Hacker Master EOA\n0x838fe9...0710", type: "hacker", value: 611000000, entity: "Mr. Whitehat EOA", chain: "Multi-Chain", address: "0x838fe924e1b03c324be449f52712b1d0a83e0710" },
      { id: "tether_blackhole", label: "Tether Freeze Address\n(33M USDT Blocked)", type: "cex", value: 33000000, entity: "Tether Blacklist", chain: "Ethereum", address: "0x35f11655...88" },
      { id: "return_multisig", label: "Poly Network Refund MultiSig", type: "hop", value: 611000000, entity: "Refund Multisig", chain: "Ethereum", address: "0x5a7112...0011" }
    ],
    edges: [
      { from: "poly_eth_vault", to: "hacker_master", label: "$273M ETH & Tokens", value: 273000000, token: "ETH/USDC", txHash: "0xb1f704...9921", timestamp: "2021-08-10 12:02 UTC" },
      { from: "poly_bsc_vault", to: "hacker_master", label: "$253M BSC Tokens", value: 253000000, token: "BNB/BUSD", txHash: "0x892a01...aa44", timestamp: "2021-08-10 12:15 UTC" },
      { from: "poly_polygon_vault", to: "hacker_master", label: "$85M Polygon Tokens", value: 85000000, token: "MATIC", txHash: "0x11029e...bb12", timestamp: "2021-08-10 12:28 UTC" },
      { from: "hacker_master", to: "tether_blackhole", label: "$33M USDT Frozen", value: 33000000, token: "USDT", txHash: "N/A", timestamp: "2021-08-10 13:45 UTC" },
      { from: "hacker_master", to: "return_multisig", label: "$578M Refunded", value: 578000000, token: "Multi-Asset", txHash: "0x77ab12...9900", timestamp: "2021-08-12 16:30 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "EthCrossChainManager", function: "verifyHeaderAndExecuteTx()", status: "SUCCESS", value: "0 ETH", note: "Crafted cross-chain transaction with method hash f6858e99" },
      { step: 2, depth: 1, contract: "EthCrossChainData", function: "putCurEpochConPkBytes()", status: "EXPLOITED", value: "0 ETH", note: "⚠️ Hash collision allowed method override, granting keeper role to hacker EOA" },
      { step: 3, depth: 1, contract: "EthCrossChainManager", function: "unlock()", status: "DRAINED", value: "$611,000,000", note: "Attacker unlocked arbitrary funds across all 3 chains" }
    ],
    cieloTimeline: [
      { time: "2021-08-10 12:02:10 UTC", event: "Mass Cross-Chain Drain", chain: "Ethereum/BSC/Polygon", detail: "$611M transferred to 0x838f... within 30 minutes" },
      { time: "2021-08-10 13:45:00 UTC", event: "Tether Freeze Action", chain: "Ethereum", detail: "Paolo Ardoino (Tether CTO) blacklisted $33M USDT on 0x838f..." },
      { time: "2021-08-12 16:30:00 UTC", event: "Full Return Initiated", chain: "Ethereum", detail: "Hacker publishes embedded memo: 'READY TO RETURN FUNDS'" }
    ]
  },
  {
    id: "cream-finance-2021",
    name: "Cream Finance Flash Loan",
    year: 2021,
    date: "October 27, 2021",
    totalStolen: 130000000,
    stolenFormatted: "$130.0 Million (yUSD / ETH)",
    victim: "Cream Finance v1",
    attackVector: "Price Oracle Manipulation & Flash Loan",
    chains: ["Ethereum"],
    status: "Laundered / Unrecovered",
    hackerEntity: "Cream Exploiter (0x9610...)",
    description: "Attacker used complex multi-contract flash loans to inflate the exchange rate of Yearn's yUSD vault tokens inside Cream's lending pools, enabling them to borrow all liquidity against over-valued collateral.",
    nodes: [
      { id: "cream_crYUSD", label: "Cream cryUSD Pool\n0x24804...9911", type: "victim", value: 130000000, entity: "Cream Lending Pool", chain: "Ethereum", address: "0x248049911" },
      { id: "yearn_vault", label: "Yearn yUSD Vault\n(Price Oracle Source)", type: "bridge", value: 130000000, entity: "Yearn Finance", chain: "Ethereum", address: "0x4b59...22" },
      { id: "hacker_eoa_cream", label: "Attacker Wallet\n0x96102...881a", type: "hacker", value: 130000000, entity: "Exploiter EOA", chain: "Ethereum", address: "0x96102881a" },
      { id: "tornado_cream", label: "Tornado Cash Pool", type: "mixer", value: 95000000, entity: "Privacy Mixer", chain: "Ethereum", address: "0x910c...11" }
    ],
    edges: [
      { from: "cream_crYUSD", to: "hacker_eoa_cream", label: "$130M Mixed Tokens", value: 130000000, token: "ETH/yUSD", txHash: "0x0fe254...881a", timestamp: "2021-10-27 13:54 UTC" },
      { from: "hacker_eoa_cream", to: "tornado_cream", label: "$95M Cleaned", value: 95000000, token: "ETH", txHash: "0xaa1122...0099", timestamp: "2021-10-28 02:15 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "MakerDAO / Aave", function: "flashLoan(500M DAI)", status: "SUCCESS", value: "500M DAI", note: "Massive liquidity flash loan" },
      { step: 2, depth: 1, contract: "Yearn Vault", function: "deposit(500M DAI)", status: "SUCCESS", value: "500M DAI", note: "Minted yUSD vault shares" },
      { step: 3, depth: 2, contract: "Cream cryUSD", function: "mint() & double-deposit", status: "MANIPULATED", value: "1B cryUSD", note: "⚠️ Oracle calculated totalAssets() using un-updated balance" },
      { step: 4, depth: 1, contract: "Cream Pool", function: "borrowAll()", status: "DRAINED", value: "$130,000,000", note: "Drained all ETH, WBTC, DAI, USDC from Cream" }
    ],
    cieloTimeline: [
      { time: "2021-10-27 13:54:11 UTC", event: "Flash Loan Arbitrage Alert", chain: "Ethereum", detail: "Cream Finance drained of $130M in 2 blocks" }
    ]
  },
  {
    id: "wormhole-bridge-2022",
    name: "Wormhole Bridge Exploit",
    year: 2022,
    date: "February 2, 2022",
    totalStolen: 325000000,
    stolenFormatted: "$325.0 Million (120k wETH)",
    victim: "Wormhole Solana-ETH Bridge",
    attackVector: "Signature Verification Bypass / Spoofed Instruction",
    chains: ["Solana", "Ethereum"],
    status: "Bailed out by Jump Crypto",
    hackerEntity: "Wormhole Exploiter (0x6291...)",
    description: "Attacker exploited a flaw in Wormhole's Solana contract instruction verification (`verify_signatures`), creating a fake sysvar instruction account to spoof guardian signatures and mint 120,000 wrapped ETH on Solana without depositing collateral.",
    nodes: [
      { id: "wormhole_sol", label: "Wormhole Solana Program\n(Bridge Contract)", type: "victim", value: 325000000, entity: "Solana Bridge Program", chain: "Solana", address: "worm2Zo...111" },
      { id: "hacker_sol", label: "Hacker Solana Wallet\n(Spoofed Mint)", type: "hacker", value: 325000000, entity: "Solana Exploiter", chain: "Solana", address: "3g8Y...sol" },
      { id: "hacker_eth", label: "Hacker Ethereum EOA\n0x6291...3381", type: "hacker", value: 325000000, entity: "Ethereum Exploiter", chain: "Ethereum", address: "0x62913381" },
      { id: "jump_crypto", label: "Jump Crypto Rescue Vault", type: "hop", value: 325000000, entity: "Bailout Vault", chain: "Ethereum", address: "0xf97781...8811" }
    ],
    edges: [
      { from: "wormhole_sol", to: "hacker_sol", label: "120,000 Unbacked wETH Minted", value: 325000000, token: "wETH", txHash: "5Kq12...sol", timestamp: "2022-02-02 18:24 UTC" },
      { from: "hacker_sol", to: "hacker_eth", label: "Bridged 93,750 ETH to Mainnet", value: 250000000, token: "ETH", txHash: "0x24823...eth", timestamp: "2022-02-02 19:10 UTC" },
      { from: "jump_crypto", to: "wormhole_sol", label: "120,000 ETH Replacement Deposit", value: 325000000, token: "ETH", txHash: "0x9812...00", timestamp: "2022-02-03 14:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "Wormhole_Solana", function: "post_vaas()", status: "SUCCESS", value: "0", note: "Submitted crafted SignatureSet account" },
      { step: 2, depth: 1, contract: "solana_program::sysvar", function: "instructions::load_instruction_at()", status: "EXPLOITED", value: "0", note: "⚠️ Attacker passed deprecated account info struct bypassing signature verification" },
      { step: 3, depth: 0, contract: "Wormhole_Solana", function: "complete_wrapped()", status: "MINTED", value: "120,000 wETH", note: "Minted 120,000 unbacked wETH" }
    ],
    cieloTimeline: [
      { time: "2022-02-02 18:24:00 UTC", event: "Solana Mint Anomaly", chain: "Solana", detail: "120k wETH minted out of thin air" },
      { time: "2022-02-03 14:00:00 UTC", event: "Jump Crypto Bailout", chain: "Ethereum", detail: "Jump Crypto replenished 120,000 ETH to keep bridge backed 1:1" }
    ]
  },
  {
    id: "ronin-bridge-2022",
    name: "Ronin Bridge Hack (Lazarus)",
    year: 2022,
    date: "March 23, 2022",
    totalStolen: 625000000,
    stolenFormatted: "$625.0 Million (173k ETH + 25.5M USDC)",
    victim: "Ronin Network (Sky Mavis)",
    attackVector: "Compromised Private Keys (5/9 Validators)",
    chains: ["Ronin Chain", "Ethereum", "Bitcoin"],
    status: "Partially Seized / OFAC Sanctioned",
    hackerEntity: "Lazarus Group (North Korea)",
    description: "North Korea's Lazarus Group compromised 4 Sky Mavis validator keys plus 1 Axie DAO validator key via a fake LinkedIn job offer PDF spear-phishing attack, gaining the 5/9 signature threshold needed to drain the bridge.",
    nodes: [
      { id: "ronin_bridge_vault", label: "Ronin Bridge Contract\n0x1a9b03...1288", type: "victim", value: 625000000, entity: "Ronin Custody Vault", chain: "Ethereum", address: "0x1a9b031288" },
      { id: "lazarus_main", label: "Lazarus Primary EOA\n0x098b71...e110", type: "hacker", value: 625000000, entity: "OFAC Sanctioned Hacker", chain: "Ethereum", address: "0x098b7142e110" },
      { id: "tornado_ronin", label: "Tornado.Cash Pools\n(100 ETH Batches)", type: "mixer", value: 450000000, entity: "Privacy Mixer", chain: "Ethereum", address: "0x47ce...88" },
      { id: "blender_io", label: "Blender.io Bitcoin Mixer", type: "mixer", value: 80000000, entity: "BTC Mixer (Sanctioned)", chain: "Bitcoin", address: "bc1q...blender" },
      { id: "huobi_binance", label: "CEX Deposits\n(Binance / Huobi / OKX)", type: "cex", value: 30000000, entity: "CEX Deposit Hops", chain: "Multi-Chain", address: "Multiple Deposit Addresses" }
    ],
    edges: [
      { from: "ronin_bridge_vault", to: "lazarus_main", label: "173,600 ETH + 25.5M USDC", value: 625000000, token: "ETH/USDC", txHash: "0xc28f91...8811", timestamp: "2022-03-23 11:58 UTC" },
      { from: "lazarus_main", to: "tornado_ronin", label: "120,000 ETH Laundered", value: 450000000, token: "ETH", txHash: "0x55aa12...0011", timestamp: "2022-04-04 08:30 UTC" },
      { from: "lazarus_main", to: "blender_io", label: "Bridged to BTC Mixer", value: 80000000, token: "BTC", txHash: "0x991122...3344", timestamp: "2022-04-10 16:20 UTC" },
      { from: "lazarus_main", to: "huobi_binance", label: "Small CEX Offramp Hops", value: 30000000, token: "ETH/USDT", txHash: "0x110022...5566", timestamp: "2022-04-14 10:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "RoninGatewayV2", function: "withdraw(Signature[] sigs)", status: "SUCCESS", value: "173,600 ETH", note: "Supplied 5 valid cryptographic signatures from stolen validator keys" },
      { step: 2, depth: 0, contract: "RoninGatewayV2", function: "withdraw(Signature[] sigs)", status: "SUCCESS", value: "25.5M USDC", note: "Second withdrawal executed 5 minutes later" }
    ],
    cieloTimeline: [
      { time: "2022-03-23 11:58:00 UTC", event: "Silent Bridge Drain", chain: "Ethereum", detail: "Funds stolen, remaining unnoticed by Sky Mavis for 6 days until a user couldn't withdraw 5k ETH" },
      { time: "2022-04-14 17:00:00 UTC", event: "OFAC Sanction Notice", chain: "US Treasury", detail: "Address 0x098b71... officially designated under SDN list as Lazarus Group" }
    ]
  },
  {
    id: "nomad-bridge-2022",
    name: "Nomad Bridge Free-for-All",
    year: 2022,
    date: "August 1, 2022",
    totalStolen: 190000000,
    stolenFormatted: "$190.0 Million (Multi-Token)",
    victim: "Nomad Bridge",
    attackVector: "Replica Initialization Bug / Copycat Exploitation",
    chains: ["Ethereum", "Moonbeam", "Evmos", "Milkomeda"],
    status: "Partially Recovered ($36M Whitehat)",
    hackerEntity: "Crowd / 300+ Copycat Looters",
    description: "During a smart contract upgrade, Nomad initialized the Replica contract setting root `0x00` as a valid message root. Anyone could replace the recipient address in the original attack payload with their own and re-submit to drain funds.",
    nodes: [
      { id: "nomad_replica", label: "Nomad Replica Contract\n0x5d943...9900", type: "victim", value: 190000000, entity: "Nomad Vault", chain: "Ethereum", address: "0x5d9439900" },
      { id: "original_hacker", label: "Original Exploit EOA\n0xb5c5...1101", type: "hacker", value: 45000000, entity: "First Exploiter", chain: "Ethereum", address: "0xb5c51101" },
      { id: "copycat_bots", label: "300+ Copycat Accounts / MEV Bots", type: "hop", value: 109000000, entity: "Looters & MEV Bots", chain: "Ethereum", address: "Multiple (300+ Addresses)" },
      { id: "nomad_recovery", label: "Nomad Official Recovery Address", type: "hop", value: 36000000, entity: "Whitehat Recovery Vault", chain: "Ethereum", address: "0x94a8...0011" }
    ],
    edges: [
      { from: "nomad_replica", to: "original_hacker", label: "First $45M Drain", value: 45000000, token: "WBTC/USDC", txHash: "0xa5fe...01", timestamp: "2022-08-01 21:32 UTC" },
      { from: "nomad_replica", to: "copycat_bots", label: "$109M Drained by Mob", value: 109000000, token: "Multi-Asset", txHash: "Hundreds of TXs", timestamp: "2022-08-01 22:00 UTC" },
      { from: "copycat_bots", to: "nomad_recovery", label: "$36M Returned by Whitehats", value: 36000000, token: "USDC/ETH", txHash: "0x7712...99", timestamp: "2022-08-03 10:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "Replica.sol", function: "process(bytes memory _message)", status: "EXPLOITED", value: "0", note: "⚠️ confirmAt[0x0] returned true because uninitialized mapping defaulted to 1" },
      { step: 2, depth: 1, contract: "BridgeRouter.sol", function: "handle()", status: "DRAINED", value: "100 WBTC", note: "Valid message bypass allowed arbitrary withdrawal" }
    ],
    cieloTimeline: [
      { time: "2022-08-01 21:32:00 UTC", event: "First Exploit TX", chain: "Ethereum", detail: "Original hacker drained 100 WBTC" },
      { time: "2022-08-01 22:15:00 UTC", event: "Social Media Frenzy", chain: "Twitter", detail: "Payload tutorial shared on Twitter; hundreds copy-paste original TX hex data" }
    ]
  },
  {
    id: "mango-markets-2022",
    name: "Mango Markets Oracle Exploit",
    year: 2022,
    date: "October 11, 2022",
    totalStolen: 114000000,
    stolenFormatted: "$114.0 Million (USDC / SOL)",
    victim: "Mango Markets v3",
    attackVector: "Oracle Price Manipulation (Self-Trading)",
    chains: ["Solana"],
    status: "Civil & Criminal Prosecution (Avraham Eisenberg)",
    hackerEntity: "Avraham Eisenberg (0x... / Solana)",
    description: "Avraham Eisenberg used two accounts to take opposing perp positions on low-liquidity MNGO tokens, manipulated the MNGO spot price by 1,300% on Switchboard/Pyth oracles, and borrowed all protocol deposits against inflated collateral.",
    nodes: [
      { id: "mango_vault", label: "Mango Markets Vault\n(Solana Pool)", type: "victim", value: 114000000, entity: "Solana Protocol Vault", chain: "Solana", address: "MangoV3Vault" },
      { id: "eisenberg_acc1", label: "Eisenberg Account A\n(Short MNGO-PERP)", type: "hacker", value: 10000000, entity: "Trader Account A", chain: "Solana", address: "AccA...sol" },
      { id: "eisenberg_acc2", label: "Eisenberg Account B\n(Long MNGO-PERP)", type: "hacker", value: 114000000, entity: "Trader Account B", chain: "Solana", address: "AccB...sol" }
    ],
    edges: [
      { from: "eisenberg_acc1", to: "eisenberg_acc2", label: "Manipulate MNGO Price from $0.038 to $0.91", value: 114000000, token: "MNGO-PERP", txHash: "4yTx...sol", timestamp: "2022-10-11 22:10 UTC" },
      { from: "mango_vault", to: "eisenberg_acc2", label: "$114M Borrowed against inflated collateral", value: 114000000, token: "USDC/SOL/MSOL", txHash: "2xSol...tx", timestamp: "2022-10-11 22:25 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "MangoProgram", function: "InitPerpMarket() & PlaceOrders", status: "SUCCESS", value: "10M USDC", note: "Funded accounts with $10M USDC to open max size perp positions" },
      { step: 2, depth: 1, contract: "MangoProgram", function: "ManipulateSpotPrice()", status: "PUMPED", value: "0", note: "Bought MNGO on spot markets driving oracle price up 1,300%" },
      { step: 3, depth: 0, contract: "MangoProgram", function: "BorrowUnbacked()", status: "DRAINED", value: "$114,000,000", note: "Borrowed all deposits; claimed it was 'highly profitable trading strategy'" }
    ],
    cieloTimeline: [
      { time: "2022-10-11 22:25:00 UTC", event: "Liquidity Drain Alert", chain: "Solana", detail: "Mango Markets pool drained of all USDC, SOL, and BTC" },
      { time: "2022-12-27 18:00:00 UTC", event: "DOJ Arrest", chain: "Off-Chain", detail: "Eisenberg arrested in Puerto Rico by FBI for commodities fraud" }
    ]
  },
  {
    id: "ftx-drain-2022",
    name: "FTX / Alameda Post-Bankruptcy Drain",
    year: 2022,
    date: "November 11, 2022",
    totalStolen: 477000000,
    stolenFormatted: "$477.0 Million (ETH / SOL / DAI)",
    victim: "FTX International & US Exchange",
    attackVector: "Unauthorized Access / Insider or Private Key Theft",
    chains: ["Ethereum", "Solana", "BNB Chain", "Bitcoin"],
    status: "Partially Frozen / Unrecovered",
    hackerEntity: "FTX Drainer (0x59ab...)",
    description: "Hours after FTX filed for Chapter 11 bankruptcy, an unauthorized entity accessed internal cold/hot wallet private keys and drained over $477M across Ethereum, Solana, and BSC, converting stolen tokens to ETH and BTC.",
    nodes: [
      { id: "ftx_hot_wallet", label: "FTX Hot/Cold Vaults\n0x59abf3...1100", type: "victim", value: 477000000, entity: "FTX Exchange Vault", chain: "Multi-Chain", address: "0x59abf31100" },
      { id: "ftx_drainer_eth", label: "FTX Drainer Main EOA\n0x59abf3...8822", type: "hacker", value: 477000000, entity: "Unauthorized Drainer", chain: "Ethereum", address: "0x59abf38822" },
      { id: "cow_swap", label: "CoW Protocol / Uniswap Swaps", type: "bridge", value: 300000000, entity: "DEX Swap Hops", chain: "Ethereum", address: "0x9001...cow" },
      { id: "thorchain_bridge", label: "THORChain Cross-Chain Bridge", type: "bridge", value: 150000000, entity: "Native BTC Bridge", chain: "Cross-Chain", address: "thor1...bridge" }
    ],
    edges: [
      { from: "ftx_hot_wallet", to: "ftx_drainer_eth", label: "$477M Multi-Token Assets", value: 477000000, token: "ETH/SOL/PAXG", txHash: "0x892a...1102", timestamp: "2022-11-11 23:45 UTC" },
      { from: "ftx_drainer_eth", to: "cow_swap", label: "Swap altcoins to 200,000 ETH", value: 300000000, token: "ETH", txHash: "0x1122...3344", timestamp: "2022-11-12 04:10 UTC" },
      { from: "ftx_drainer_eth", to: "thorchain_bridge", label: "Bridge ETH -> Native BTC", value: 150000000, token: "BTC", txHash: "0x4455...6677", timestamp: "2022-11-20 12:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "FTX Wallet Control", function: "transfer()", status: "UNAUTHORIZED", value: "$477,000,000", note: "Attacker possessed valid private key/API access to move funds post-bankruptcy" }
    ],
    cieloTimeline: [
      { time: "2022-11-11 23:45:00 UTC", event: "Emergency Drain Alert", chain: "Ethereum", detail: "Unusual movement of $477M across FTX wallets" },
      { time: "2022-11-12 02:00:00 UTC", event: "FTX General Counsel Statement", chain: "Telegram", detail: "Ryne Miller confirms FTX apps updated with malware & wallets compromised" }
    ]
  },
  {
    id: "euler-finance-2023",
    name: "Euler Finance Flash Loan Exploit",
    year: 2023,
    date: "March 13, 2023",
    totalStolen: 197000000,
    stolenFormatted: "$197.0 Million (DAI / WBTC / stakedETH)",
    victim: "Euler Finance",
    attackVector: "Flash Loan & Donation Logic Vulnerability",
    chains: ["Ethereum"],
    status: "100% Funds Returned (Negotiated)",
    hackerEntity: "Euler Exploiter (0x5f25...)",
    description: "Attacker used a $30M DAI flash loan to mint eDAI, donated eDAI to the reserves pool without health-checking debt tokens (dDAI), and triggered a self-liquidation to profit off a skewed exchange rate.",
    nodes: [
      { id: "euler_vault", label: "Euler Main Pool\n0x27182...9901", type: "victim", value: 197000000, entity: "Euler Vault", chain: "Ethereum", address: "0x271829901" },
      { id: "hacker_euler", label: "Hacker EOA\n0x5f2599...1188", type: "hacker", value: 197000000, entity: "Exploiter Wallet", chain: "Ethereum", address: "0x5f25991188" },
      { id: "hacker_subacc", label: "Hacker Liquidation Sub-account", type: "hop", value: 197000000, entity: "Liquidation Proxy", chain: "Ethereum", address: "0xebc2...88" },
      { id: "euler_multisig", label: "Euler Protocol Refund Vault", type: "hop", value: 197000000, entity: "Returned Reserve", chain: "Ethereum", address: "0x3f11...0011" }
    ],
    edges: [
      { from: "euler_vault", to: "hacker_euler", label: "$197M Stolen Assets", value: 197000000, token: "DAI/WBTC/stETH", txHash: "0xc66f8...01", timestamp: "2023-03-13 08:50 UTC" },
      { from: "hacker_euler", to: "euler_multisig", label: "100% Refunded after on-chain negotiations", value: 197000000, token: "ETH/DAI", txHash: "0x8877...2211", timestamp: "2023-04-03 15:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "AaveV3", function: "flashLoan(30M DAI)", status: "SUCCESS", value: "30M DAI", note: "Flash loan borrowed" },
      { step: 2, depth: 1, contract: "eDAI", function: "mint(20M DAI)", status: "SUCCESS", value: "20M DAI", note: "Minted 19.5M eDAI and 19.5M dDAI debt" },
      { step: 3, depth: 1, contract: "eDAI", function: "donateToReserves(10M eDAI)", status: "EXPLOITED", value: "10M eDAI", note: "⚠️ DONATION BUG: Reduced eDAI balance without checking health factor!" },
      { step: 4, depth: 2, contract: "EulerEToken", function: "liquidate()", status: "DRAINED", value: "$197,000,000", note: "Self-liquidated insolvent sub-account at maximum bonus discount" }
    ],
    cieloTimeline: [
      { time: "2023-03-13 08:50:00 UTC", event: "Mass Vault Liquidation", chain: "Ethereum", detail: "Euler Finance protocol drained of $197M in 6 transactions" },
      { time: "2023-03-25 11:00:00 UTC", event: "On-Chain Message Negotiations", chain: "Ethereum Input Data", detail: "Hacker posts message: 'I want to make peace... returning all funds'" }
    ]
  },
  {
    id: "curve-vyper-2023",
    name: "Curve Finance Vyper Reentrancy",
    year: 2023,
    date: "July 30, 2023",
    totalStolen: 73500000,
    stolenFormatted: "$73.5 Million (CRV / ETH / pETH)",
    victim: "Curve Finance Pools (alETH/msETH/pETH)",
    attackVector: "Compiler Bug (Vyper Reentrancy Lock Failure)",
    chains: ["Ethereum"],
    status: "73% Returned / Whitehat Recovered",
    hackerEntity: "Vyper Exploiter & MEV Arbitrageurs",
    description: "Flaws in Vyper compiler versions 0.2.15, 0.2.16, and 0.3.0 rendered `@nonreentrant` guards non-functional, enabling reentrancy attacks on Curve liquidity pools during raw ETH swaps.",
    nodes: [
      { id: "curve_aleth", label: "Curve alETH/ETH Pool\n0x6ec2...9900", type: "victim", value: 73500000, entity: "Curve Pool Vault", chain: "Ethereum", address: "0x6ec29900" },
      { id: "vyper_hacker", label: "Primary Exploiter EOA\n0xb752...1101", type: "hacker", value: 50000000, entity: "Vyper Exploiter", chain: "Ethereum", address: "0xb7521101" },
      { id: "cvrp_mev_bot", label: "cvrp.eth (Whitehat MEV Bot)\n0x6b92...8811", type: "hop", value: 5400000, entity: "Whitehat MEV Bot", chain: "Ethereum", address: "0x6b928811" },
      { id: "curve_dao", label: "Curve Community Treasury", type: "hop", value: 5400000, entity: "Refund Vault", chain: "Ethereum", address: "0x40ec...00" }
    ],
    edges: [
      { from: "curve_aleth", to: "vyper_hacker", label: "Drained 19M CRV & 7,000 ETH", value: 50000000, token: "CRV/ETH", txHash: "0xa8412...01", timestamp: "2023-07-30 13:40 UTC" },
      { from: "curve_aleth", to: "cvrp_mev_bot", label: "Front-run 2,881 ETH ($5.4M)", value: 5400000, token: "ETH", txHash: "0xc882...99", timestamp: "2023-07-30 13:42 UTC" },
      { from: "cvrp_mev_bot", to: "curve_dao", label: "100% Whitehat Return of $5.4M", value: 5400000, token: "ETH", txHash: "0x1122...00", timestamp: "2023-07-31 09:15 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "CurvePool.vy", function: "remove_liquidity_one_coin()", status: "SUCCESS", value: "0", note: "Initiates ETH transfer to caller" },
      { step: 2, depth: 1, contract: "Attacker.sol", function: "fallback()", status: "REENTER", value: "0", note: "⚠️ COMPILER BUG: Vyper @nonreentrant used wrong storage slot; reentrancy lock failed!" },
      { step: 3, depth: 2, contract: "CurvePool.vy", function: "add_liquidity()", status: "DRAINED", value: "7,000 ETH", note: "Manipulated virtual price and drained pool reserves" }
    ],
    cieloTimeline: [
      { time: "2023-07-30 13:40:00 UTC", event: "Compiler Exploit Alert", chain: "Ethereum", detail: "Vyper 0.2.15 reentrancy bug exploited across 4 Curve pools" }
    ]
  },
  {
    id: "mixin-network-2023",
    name: "Mixin Network Cloud Breach",
    year: 2023,
    date: "September 23, 2023",
    totalStolen: 200000000,
    stolenFormatted: "$200.0 Million (BTC / ETH / USDT)",
    victim: "Mixin Network Cloud Database",
    attackVector: "Cloud Infrastructure Provider Compromise",
    chains: ["Bitcoin", "Ethereum", "Mixin Kernel"],
    status: "50% Loss Coverage Offered",
    hackerEntity: "Unidentified Hacker Group",
    description: "Mixin Network's cloud database provider was compromised, compromising multi-sig node keys backing the Mixin Network decentralized database and leading to the theft of $200M in user assets.",
    nodes: [
      { id: "mixin_cloud", label: "Mixin Node Cloud Vault\n(Hot Wallet Database)", type: "victim", value: 200000000, entity: "Cloud Node Vault", chain: "Mixin / Cross-Chain", address: "MixinNode01" },
      { id: "mixin_hacker", label: "Hacker Bitcoin & ETH EOA", type: "hacker", value: 200000000, entity: "Cloud Exploiter", chain: "Bitcoin / Ethereum", address: "bc1q...mixin / 0x8891..." }
    ],
    edges: [
      { from: "mixin_cloud", to: "mixin_hacker", label: "$200M BTC / ETH / USDT", value: 200000000, token: "BTC/ETH/USDT", txHash: "0x77112...00", timestamp: "2023-09-23 02:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "MixinCloudNode", function: "databaseAccess()", status: "BREACHED", value: "$200,000,000", note: "Attacker breached cloud hosting provider database to siphon private keys" }
    ],
    cieloTimeline: [
      { time: "2023-09-23 02:00:00 UTC", event: "Cloud Provider Compromise", chain: "Off-Chain", detail: "Mixin Network database breached, $200M drained" }
    ]
  },
  {
    id: "orbit-chain-2024",
    name: "Orbit Chain Bridge Hack",
    year: 2024,
    date: "December 31, 2023 / Jan 1, 2024",
    totalStolen: 81500000,
    stolenFormatted: "$81.5 Million (ETH / DAI / WBTC / USDT)",
    victim: "Orbit Bridge",
    attackVector: "Validator Private Key Compromise",
    chains: ["Ethereum", "Orbit Chain", "Klaytn"],
    status: "Unrecovered / Active Track",
    hackerEntity: "Orbit Exploiter (0x9263...)",
    description: "On New Year's Eve, attackers compromised Orbit Chain bridge validator nodes and executed unauthorized withdrawals of ETH, DAI, WBTC, and USDT totalling $81.5M across 5 separate transactions.",
    nodes: [
      { id: "orbit_eth_vault", label: "Orbit Bridge ETH Contract\n0x1bf68...9900", type: "victim", value: 81500000, entity: "Orbit Custody Vault", chain: "Ethereum", address: "0x1bf689900" },
      { id: "orbit_hacker_1", label: "Orbit Hacker EOA #1\n0x9263...1100", type: "hacker", value: 50000000, entity: "Exploiter Wallet 1", chain: "Ethereum", address: "0x92631100" },
      { id: "orbit_hacker_2", label: "Orbit Hacker EOA #2\n0xa728...8811", type: "hacker", value: 31500000, entity: "Exploiter Wallet 2", chain: "Ethereum", address: "0xa7288811" },
      { id: "tornado_orbit", label: "Tornado Cash Pool Deposits", type: "mixer", value: 81500000, entity: "Privacy Mixer", chain: "Ethereum", address: "0x910c...orbit" }
    ],
    edges: [
      { from: "orbit_eth_vault", to: "orbit_hacker_1", label: "26,741 ETH + 20M DAI", value: 50000000, token: "ETH/DAI", txHash: "0x3841...01", timestamp: "2023-12-31 20:55 UTC" },
      { from: "orbit_eth_vault", to: "orbit_hacker_2", label: "231 WBTC + 10M USDT", value: 31500000, token: "WBTC/USDT", txHash: "0x5512...88", timestamp: "2023-12-31 21:10 UTC" },
      { from: "orbit_hacker_1", to: "tornado_orbit", label: "Mixer Deposits", value: 50000000, token: "ETH", txHash: "0x9911...22", timestamp: "2024-01-05 14:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "OrbitBridgeVault", function: "withdraw()", status: "UNAUTHORIZED", value: "$81,500,000", note: "Stolen validator keys generated valid multi-sig signature payload" }
    ],
    cieloTimeline: [
      { time: "2023-12-31 20:55:00 UTC", event: "New Year's Eve Bridge Drain", chain: "Ethereum", detail: "Orbit Bridge drained of $81.5M in 5 consecutive transactions" }
    ]
  },
  {
    id: "dmm-bitcoin-2024",
    name: "DMM Bitcoin / Bybit Heist",
    year: 2024,
    date: "May 31, 2024",
    totalStolen: 305000000,
    stolenFormatted: "$305.0 Million (4,502.9 BTC)",
    victim: "DMM Bitcoin Japanese Exchange",
    attackVector: "Exchange Private Key Leak & Address Poisoning",
    chains: ["Bitcoin"],
    status: "Under Active Investigation (Lazarus Suspected)",
    hackerEntity: "DMM Hacker / Lazarus Syndicate",
    description: "Japanese licensed crypto exchange DMM Bitcoin lost 4,502.9 BTC ($305M) after attackers gained unauthorized access to private key infrastructure and transferred funds into 10 split addresses.",
    nodes: [
      { id: "dmm_vault", label: "DMM Bitcoin Cold Reserve\n(Japanese Regulated Vault)", type: "victim", value: 305000000, entity: "Exchange Vault", chain: "Bitcoin", address: "bc1q...dmm" },
      { id: "dmm_hacker_btc", label: "DMM Hacker Master BTC Vault", type: "hacker", value: 305000000, entity: "Hacker BTC Address", chain: "Bitcoin", address: "bc1q...hackerDMM" },
      { id: "eXch_mixer", label: "eXch No-KYC Swapper / Mixer", type: "mixer", value: 150000000, entity: "Instant Exchange", chain: "Bitcoin / Cross-Chain", address: "eXch...swap" }
    ],
    edges: [
      { from: "dmm_vault", to: "dmm_hacker_btc", label: "4,502.9 BTC ($305M)", value: 305000000, token: "BTC", txHash: "6c2b...btc", timestamp: "2024-05-31 04:20 UTC" },
      { from: "dmm_hacker_btc", to: "eXch_mixer", label: "Split across 10 output hops & eXch", value: 150000000, token: "BTC", txHash: "88aa...tx", timestamp: "2024-06-02 10:15 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "Bitcoin Network", function: "sendtoaddress(4502.9 BTC)", status: "UNAUTHORIZED", value: "4,502.9 BTC", note: "Unauthorized transaction broadcast using compromised hardware wallet / key" }
    ],
    cieloTimeline: [
      { time: "2024-05-31 04:20:00 UTC", event: "Massive BTC Outflow Alert", chain: "Bitcoin", detail: "4,502.9 BTC moved from DMM Exchange hot/cold vault" },
      { time: "2024-06-05 12:00:00 UTC", event: "ZachXBT Investigation Post", chain: "Twitter/X", detail: "ZachXBT identifies laundering through eXch and Wasabi mixers" }
    ]
  },
  {
    id: "wazirx-2024",
    name: "WazirX Multisig Exploit",
    year: 2024,
    date: "July 18, 2024",
    totalStolen: 230000000,
    stolenFormatted: "$230.0 Million (Multi-Token)",
    victim: "WazirX (Indian Exchange)",
    attackVector: "Safe{Wallet} Multisig Compromise / Malicious Upgrade",
    chains: ["Ethereum"],
    status: "Unrecovered / Losses Socialized",
    hackerEntity: "Lazarus Group (North Korea)",
    description: "Attackers compromised WazirX's Gnosis Safe multisig by tricking signers into approving a malicious contract upgrade — the transaction shown in the custody interface differed from the payload actually signed. They drained $230M in ETH and ERC-20 tokens (SHIB, PEPE, USDT, GALA), later laundered through Tornado Cash. Elliptic and ZachXBT attributed the theft to North Korea's Lazarus Group.",
    nodes: [
      { id: "wazirx_safe", label: "WazirX Safe Multisig\n0x27fd43...a4f8", type: "victim", value: 230000000, entity: "Exchange Custody Vault", chain: "Ethereum", address: "0x27fd43...a4f8" },
      { id: "wazirx_hacker", label: "Lazarus Exploiter EOA\n0x6eeda...5f2c", type: "hacker", value: 230000000, entity: "OFAC Linked Hacker", chain: "Ethereum", address: "0x6eeda...5f2c" },
      { id: "tornado_wazirx", label: "Tornado Cash Pools\n(100 ETH Batches)", type: "mixer", value: 150000000, entity: "Privacy Mixer", chain: "Ethereum", address: "0x8589...tornado" }
    ],
    edges: [
      { from: "wazirx_safe", to: "wazirx_hacker", label: "$230M ETH + SHIB/PEPE/USDT", value: 230000000, token: "ETH/ERC-20", txHash: "0x48e5a1...b21c", timestamp: "2024-07-18 12:16 UTC" },
      { from: "wazirx_hacker", to: "tornado_wazirx", label: "$150M Laundered via Mixer", value: 150000000, token: "ETH", txHash: "0x9a71c2...004d", timestamp: "2024-07-22 09:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "GnosisSafeProxy", function: "execTransaction(...)", status: "SUCCESS", value: "0 ETH", note: "Signers approved a masked transaction; the Liminal UI payload differed from the signed calldata" },
      { step: 2, depth: 1, contract: "GnosisSafe", function: "delegatecall -> upgradeTo(attacker)", status: "EXPLOITED", value: "0 ETH", note: "⚠️ Safe implementation swapped to an attacker-controlled contract" },
      { step: 3, depth: 2, contract: "MaliciousImpl.sol", function: "sweepTokens()", status: "DRAINED", value: "$230,000,000", note: "All ETH and ERC-20 balances swept from the multisig" }
    ],
    cieloTimeline: [
      { time: "2024-07-18 12:16:00 UTC", event: "Mass Token Outflow", chain: "Ethereum", detail: "$230M across 6 tokens moved to 0x6eeda..." },
      { time: "2024-07-19 10:00:00 UTC", event: "Lazarus Attribution", chain: "Off-Chain", detail: "Elliptic & ZachXBT link theft to North Korea's Lazarus Group" }
    ]
  },
  {
    id: "radiant-capital-2024",
    name: "Radiant Capital Exploit",
    year: 2024,
    date: "October 16, 2024",
    totalStolen: 50000000,
    stolenFormatted: "$50.0 Million (Cross-Chain)",
    victim: "Radiant Capital",
    attackVector: "Developer Device Malware / Multisig Key Compromise",
    chains: ["Arbitrum", "BNB Chain", "Ethereum"],
    status: "Unrecovered / DPRK Attributed",
    hackerEntity: "North Korea (DPRK / Citrine Sleet)",
    description: "DPRK operatives infected multiple Radiant developer devices with malware and harvested private keys to three of the protocol's multisig signers. Signers unknowingly approved malicious transactions that displayed as legitimate in their wallets, transferring ownership of the lending pools and draining ~$50M across Arbitrum and BNB Chain.",
    nodes: [
      { id: "radiant_pools", label: "Radiant Lending Pools\n(Arbitrum / BSC)", type: "victim", value: 50000000, entity: "Lending Pool Vault", chain: "Arbitrum", address: "0xa950...pools" },
      { id: "radiant_hacker", label: "DPRK Exploiter EOA\n0x0629...11ac", type: "hacker", value: 50000000, entity: "DPRK Exploiter", chain: "Ethereum", address: "0x0629...11ac" },
      { id: "radiant_bridge", label: "Cross-Chain Bridge Hop\n(Arbitrum -> Ethereum)", type: "bridge", value: 50000000, entity: "Bridge Hop", chain: "Cross-Chain", address: "0x33ab...bridge" }
    ],
    edges: [
      { from: "radiant_pools", to: "radiant_hacker", label: "$50M rTokens Redeemed", value: 50000000, token: "ETH/USDC/USDT", txHash: "0x7c9a01...ff21", timestamp: "2024-10-16 20:52 UTC" },
      { from: "radiant_hacker", to: "radiant_bridge", label: "Bridged to Ethereum", value: 50000000, token: "ETH", txHash: "0x11de44...aa90", timestamp: "2024-10-17 03:30 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "LendingPool (Proxy)", function: "transferOwnership(attacker)", status: "UNAUTHORIZED", value: "0 ETH", note: "Malware-stolen signer keys approved an ownership transfer to the attacker" },
      { step: 2, depth: 1, contract: "LendingPool", function: "upgradeToAndCall(malicious)", status: "EXPLOITED", value: "0 ETH", note: "⚠️ Pools upgraded to a malicious implementation contract" },
      { step: 3, depth: 2, contract: "MaliciousImpl.sol", function: "drain()", status: "DRAINED", value: "$50,000,000", note: "Pool reserves swept across Arbitrum and BNB Chain" }
    ],
    cieloTimeline: [
      { time: "2024-10-16 20:52:00 UTC", event: "Ownership Transfer", chain: "Arbitrum", detail: "Radiant pool ownership moved to attacker EOA" },
      { time: "2024-10-17 12:00:00 UTC", event: "DPRK Attribution", chain: "Off-Chain", detail: "Mandiant & ZachXBT attribute the malware intrusion to North Korea" }
    ]
  },
  {
    id: "phemex-2025",
    name: "Phemex Hot Wallet Hack",
    year: 2025,
    date: "January 23, 2025",
    totalStolen: 73000000,
    stolenFormatted: "$73.0 Million (Multi-Chain)",
    victim: "Phemex Exchange",
    attackVector: "Hot Wallet Private Key Compromise",
    chains: ["Ethereum", "Solana", "BNB Chain"],
    status: "Users Reimbursed / Lazarus Suspected",
    hackerEntity: "Phemex Drainer (Lazarus Suspected)",
    description: "Singapore-based exchange Phemex suffered a hot wallet compromise spanning 11+ blockchains, with attackers draining roughly $73M and swapping assets to ETH. On-chain analysts linked the laundering pattern to North Korea's Lazarus Group. Phemex pledged to fully reimburse affected users.",
    nodes: [
      { id: "phemex_hot", label: "Phemex Hot Wallets\n(Multi-Chain)", type: "victim", value: 73000000, entity: "Exchange Hot Wallet", chain: "Multi-Chain", address: "0x33ff...phemex" },
      { id: "phemex_hacker", label: "Phemex Drainer EOA\n0x33d0...7b41", type: "hacker", value: 73000000, entity: "Exchange Drainer", chain: "Ethereum", address: "0x33d0...7b41" },
      { id: "phemex_dex", label: "DEX Swap Hops\n(Assets -> ETH)", type: "bridge", value: 60000000, entity: "DEX Swap Hops", chain: "Multi-Chain", address: "0x901a...swap" }
    ],
    edges: [
      { from: "phemex_hot", to: "phemex_hacker", label: "$73M Across 11 Chains", value: 73000000, token: "ETH/SOL/BNB", txHash: "0x6b2f19...c0a2", timestamp: "2025-01-23 06:30 UTC" },
      { from: "phemex_hacker", to: "phemex_dex", label: "Swapped altcoins to ETH", value: 60000000, token: "ETH", txHash: "0x88ca31...129f", timestamp: "2025-01-23 09:10 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "Phemex Hot Wallet", function: "transfer()", status: "UNAUTHORIZED", value: "$73,000,000", note: "Attacker held valid private keys and drained hot wallets across 11+ chains" }
    ],
    cieloTimeline: [
      { time: "2025-01-23 06:30:00 UTC", event: "Anomalous Multi-Chain Outflow", chain: "Multi-Chain", detail: "$73M drained from Phemex hot wallets in minutes" },
      { time: "2025-01-24 08:00:00 UTC", event: "ZachXBT Alert", chain: "Twitter/X", detail: "Laundering pattern flagged as consistent with Lazarus Group" }
    ]
  },
  {
    id: "bybit-2025",
    name: "Bybit Cold Wallet Heist",
    year: 2025,
    date: "February 21, 2025",
    totalStolen: 1460000000,
    stolenFormatted: "$1.46 Billion (401k ETH)",
    victim: "Bybit Exchange",
    attackVector: "Safe{Wallet} UI Compromise / Blind-Signed Delegatecall",
    chains: ["Ethereum"],
    status: "Largest Hack Ever / Bybit Remained Solvent",
    hackerEntity: "Lazarus Group / TraderTraitor (North Korea)",
    description: "The largest crypto theft in history. Lazarus (TraderTraitor) compromised the Safe{Wallet} front-end and served malicious JavaScript that caused Bybit's signers to blind-sign a delegatecall, swapping the ETH cold wallet's implementation for an attacker contract. Around 401,347 ETH (~$1.46B) was drained in a single transaction and laundered through THORChain, no-KYC swappers and mixers. Bybit covered the shortfall via loans and stayed backed 1:1.",
    nodes: [
      { id: "bybit_cold", label: "Bybit ETH Cold Wallet\n0x1db92...c1f7", type: "victim", value: 1460000000, entity: "Exchange Cold Vault", chain: "Ethereum", address: "0x1db92...c1f7" },
      { id: "bybit_hacker", label: "Bybit Exploiter EOA\n0x4766...86E2", type: "hacker", value: 1460000000, entity: "Lazarus Exploiter", chain: "Ethereum", address: "0x47666Fab8bd0Ac7003bce3f5C3585383F09486E2" },
      { id: "thorchain_bybit", label: "THORChain Cross-Chain\n(ETH -> BTC)", type: "bridge", value: 900000000, entity: "Native BTC Bridge", chain: "Cross-Chain", address: "thor1...bybit" },
      { id: "exch_bybit", label: "eXch No-KYC Swapper", type: "mixer", value: 300000000, entity: "Instant Exchange / Mixer", chain: "Multi-Chain", address: "eXch...swap" }
    ],
    edges: [
      { from: "bybit_cold", to: "bybit_hacker", label: "401,347 ETH ($1.46B)", value: 1460000000, token: "ETH/stETH/mETH", txHash: "0xb61413...2f0e", timestamp: "2025-02-21 14:16 UTC" },
      { from: "bybit_hacker", to: "thorchain_bybit", label: "Bridged ETH -> Native BTC", value: 900000000, token: "BTC", txHash: "0x2c88fa...9911", timestamp: "2025-02-22 00:00 UTC" },
      { from: "bybit_hacker", to: "exch_bybit", label: "Laundered via eXch", value: 300000000, token: "ETH", txHash: "0x77b0ce...4a2d", timestamp: "2025-02-23 12:00 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "SafeProxy", function: "execTransaction(...)", status: "SUCCESS", value: "0 ETH", note: "Signers blind-signed a transaction masked by the compromised Safe{Wallet} UI" },
      { step: 2, depth: 1, contract: "GnosisSafe", function: "delegatecall(attacker)", status: "EXPLOITED", value: "0 ETH", note: "⚠️ DELEGATECALL swapped the cold wallet implementation to an attacker contract" },
      { step: 3, depth: 2, contract: "MaliciousImpl.sol", function: "sweepETH()", status: "DRAINED", value: "401,347 ETH", note: "Entire ETH cold wallet drained in one transaction (~$1.46B)" }
    ],
    cieloTimeline: [
      { time: "2025-02-21 14:16:00 UTC", event: "Record Cold Wallet Drain", chain: "Ethereum", detail: "401,347 ETH (~$1.46B) moved to 0x4766Fab..." },
      { time: "2025-02-21 15:44:00 UTC", event: "ZachXBT / Arkham Attribution", chain: "Twitter/X", detail: "Attack attributed to Lazarus Group within hours" },
      { time: "2025-02-26 00:00:00 UTC", event: "FBI TraderTraitor Alert", chain: "Off-Chain", detail: "FBI confirms North Korea 'TraderTraitor' responsible" }
    ]
  },
  {
    id: "cetus-2025",
    name: "Cetus Protocol AMM Exploit",
    year: 2025,
    date: "May 22, 2025",
    totalStolen: 223000000,
    stolenFormatted: "$223.0 Million (SUI / USDC)",
    victim: "Cetus Protocol (Sui DEX)",
    attackVector: "Liquidity Math Overflow / Faulty Checked-Shift",
    chains: ["Sui"],
    status: "Partially Frozen by Sui Validators",
    hackerEntity: "Cetus Exploiter",
    description: "Sui's largest DEX lost ~$223M when an attacker exploited a flawed overflow check (checked_shlw) in Cetus's concentrated-liquidity math, opening enormous positions with a negligible deposit and draining pool reserves. Sui validators controversially froze ~$162M by censoring the attacker's transactions, and a governance vote coordinated a partial recovery.",
    nodes: [
      { id: "cetus_pools", label: "Cetus Liquidity Pools\n(Sui AMM)", type: "victim", value: 223000000, entity: "AMM Pool Vault", chain: "Sui", address: "0xcetus...pool" },
      { id: "cetus_hacker", label: "Cetus Exploiter\n0x8fda...sui", type: "hacker", value: 223000000, entity: "AMM Exploiter", chain: "Sui", address: "0x8fda...sui" },
      { id: "sui_validators", label: "Sui Validator Freeze\n($162M Censored)", type: "hop", value: 162000000, entity: "Validator Freeze", chain: "Sui", address: "SuiValidators" },
      { id: "cetus_bridge", label: "Wormhole Bridge Hop\n(SUI -> ETH)", type: "bridge", value: 60000000, entity: "Bridge Hop", chain: "Cross-Chain", address: "0x61ac...bridge" }
    ],
    edges: [
      { from: "cetus_pools", to: "cetus_hacker", label: "$223M Drained", value: 223000000, token: "SUI/USDC", txHash: "9xTq...sui", timestamp: "2025-05-22 10:40 UTC" },
      { from: "cetus_hacker", to: "sui_validators", label: "$162M Frozen by Validators", value: 162000000, token: "SUI/USDC", txHash: "N/A (Censored)", timestamp: "2025-05-22 12:00 UTC" },
      { from: "cetus_hacker", to: "cetus_bridge", label: "$60M Bridged to Ethereum", value: 60000000, token: "ETH", txHash: "0x4d8ba1...77cc", timestamp: "2025-05-22 11:20 UTC" }
    ],
    callTrace: [
      { step: 1, depth: 0, contract: "CetusPool (Move)", function: "add_liquidity()", status: "MANIPULATED", value: "0", note: "⚠️ checked_shlw overflow bypass let a 1-token deposit mint enormous liquidity" },
      { step: 2, depth: 1, contract: "CetusPool (Move)", function: "remove_liquidity() / swap()", status: "DRAINED", value: "$223,000,000", note: "Attacker withdrew real reserves against the fake liquidity position" }
    ],
    cieloTimeline: [
      { time: "2025-05-22 10:40:00 UTC", event: "AMM Liquidity Drain", chain: "Sui", detail: "Cetus pools drained of ~$223M" },
      { time: "2025-05-22 12:00:00 UTC", event: "Validator Freeze", chain: "Sui", detail: "Sui validators censor attacker transactions, freezing ~$162M" }
    ]
  }
];

// Derived automatically from INCIDENTS so the year filter never goes stale as
// new incidents are added (previously a hardcoded list that had to be edited by hand).
export const YEARS = ["All", ...Array.from(new Set(INCIDENTS.map(i => i.year))).sort((a, b) => a - b)];
