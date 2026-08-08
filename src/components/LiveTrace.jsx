import React, { useState } from 'react';
import { Radar, Search, Loader2, AlertTriangle, Wallet, FileCode2, Hash, Coins, Tag } from 'lucide-react';
import { fetchAddressProfile, buildIncidentFromAddress, isValidEvmAddress, shortAddr } from '../data/liveApi';
import BubbleMapGraph from './BubbleMapGraph';
import EntityInspector from './EntityInspector';

const EXAMPLES = [
  { label: 'Bybit Exploiter', addr: '0x47666Fab8bd0Ac7003bce3f5C3585383F09486E2' },
  { label: 'vitalik.eth', addr: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
  { label: 'Binance Hot Wallet', addr: '0x28C6c06298d514Db089934071355E5743bf21d60' },
];

export default function LiveTrace() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [incident, setIncident] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const runLookup = async (address) => {
    if (!isValidEvmAddress(address)) {
      setError('Enter a valid 0x… 42-character Ethereum address.');
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedNode(null);
    try {
      const p = await fetchAddressProfile(address);
      setProfile(p);
      setIncident(buildIncidentFromAddress(p));
    } catch (e) {
      setError(e.message || 'Lookup failed. The public RPC or Blockscout API may be rate-limited — try again.');
      setProfile(null);
      setIncident(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    runLookup(input.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search / control bar */}
      <div className="bg-[#0b111e] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">Live On-Chain Address Trace</h3>
            <p className="text-[11px] text-slate-400">
              Real Ethereum data via raw JSON-RPC + Blockscout — keyless, client-side.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste an Ethereum address (0x…)"
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold text-xs px-5 py-2 rounded-lg transition flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
            <span>{loading ? 'Tracing…' : 'Trace Address'}</span>
          </button>
        </form>

        {/* Example chips */}
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <span className="text-[10px] text-slate-500 uppercase font-medium">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.addr}
              onClick={() => { setInput(ex.addr); runLookup(ex.addr); }}
              className="text-[11px] font-mono bg-[#131c30] hover:bg-slate-800 text-cyan-300 border border-slate-700 px-2 py-0.5 rounded transition"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!profile && !loading && (
        <div className="bg-[#0b111e] border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
          <Radar className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-xs">Trace any live Ethereum address to render its balance, entity label, and recent fund-flow graph.</p>
        </div>
      )}

      {/* Profile summary metrics */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard icon={<Coins className="w-4 h-4 text-emerald-400" />} label="ETH Balance"
            value={`${profile.ethBalance.toFixed(4)} ETH`} />
          <MetricCard icon={<Hash className="w-4 h-4 text-cyan-400" />} label="Tx Count (nonce)"
            value={profile.txCount.toLocaleString()} />
          <MetricCard icon={profile.isContract ? <FileCode2 className="w-4 h-4 text-pink-400" /> : <Wallet className="w-4 h-4 text-slate-300" />}
            label="Address Type" value={profile.isContract ? 'Smart Contract' : 'EOA Wallet'} />
          <MetricCard icon={<Tag className="w-4 h-4 text-amber-400" />} label="Entity Label"
            value={profile.label || 'Unlabeled'} />
        </div>
      )}

      {/* Live graph + inspector (reuses the historical-incident components) */}
      {incident && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[620px]">
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
            <BubbleMapGraph
              incident={incident}
              selectedNodeId={selectedNode?.id}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
            <EntityInspector selectedNode={selectedNode} incident={incident} />
          </div>
        </div>
      )}

      {profile && !profile.enriched && (
        <p className="text-[11px] text-slate-500 text-center">
          Showing JSON-RPC data only — Blockscout enrichment (labels / transfer history) was unavailable or rate-limited for this address.
        </p>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-[9px] text-slate-400 uppercase font-medium">{label}</div>
        <div className="text-xs font-bold text-slate-100 font-mono truncate">{value}</div>
      </div>
    </div>
  );
}
