import React, { useState } from 'react';
import { Wallet, Copy, Check, Tag, Clock, Activity, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function EntityInspector({ selectedNode, incident }) {
  const [copied, setCopied] = useState(false);

  const activeNode = selectedNode || incident?.nodes.find(n => n.type === 'hacker') || incident?.nodes[0];

  if (!activeNode) {
    return (
      <div className="bg-[#0e1526] border border-slate-800 rounded-xl p-4 text-center text-slate-400">
        <Wallet className="w-6 h-6 text-slate-600 mx-auto mb-1" />
        <p className="text-xs">Click any graph node to inspect address portfolio & Cielo trace.</p>
      </div>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const incomingTxs = incident?.edges.filter(e => e.to === activeNode.id) || [];
  const outgoingTxs = incident?.edges.filter(e => e.from === activeNode.id) || [];

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'hacker': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'victim': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'mixer': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'bridge': return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'cex': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-[#0b111e] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-3.5 h-full overflow-y-auto">
      
      {/* Header Badge */}
      <div className="bg-[#11192b] border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(activeNode.type)}`}>
            {activeNode.entity}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
            {activeNode.chain}
          </span>
        </div>

        <h3 className="text-sm font-bold text-white font-heading">{activeNode.label.split('\n')[0]}</h3>

        {/* Address */}
        {activeNode.address && (
          <div className="mt-2 flex items-center justify-between bg-[#080d17] border border-slate-800 rounded px-2.5 py-1.5">
            <span className="font-mono text-xs text-cyan-300 truncate max-w-[190px]">
              {activeNode.address}
            </span>
            <button
              onClick={() => handleCopy(activeNode.address)}
              className="p-0.5 text-slate-400 hover:text-cyan-400 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Volume & Risk Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-800">
          <div>
            <div className="text-[9px] text-slate-400 uppercase font-medium">Vol / Balance</div>
            <div className="text-xs font-bold font-mono text-emerald-400">
              ${activeNode.value ? activeNode.value.toLocaleString() : '0'}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase font-medium">Risk Score</div>
            <div className="text-xs font-bold font-mono text-red-400">
              {activeNode.type === 'hacker' ? '98/100 (HIGH)' : '15/100 (LOW)'}
            </div>
          </div>
        </div>
      </div>

      {/* Arkham Entity Card */}
      <div className="bg-[#11192b] border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-200">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Arkham Intelligence</span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 rounded">
            99% Match
          </span>
        </div>

        <div className="text-xs text-slate-300 space-y-1">
          <div className="flex justify-between py-0.5 border-b border-slate-800">
            <span className="text-slate-400">Tag:</span>
            <span className="font-semibold text-white">{activeNode.entity}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">Sanction:</span>
            <span className={activeNode.type === 'hacker' ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {activeNode.type === 'hacker' ? 'OFAC Listed' : 'Clean'}
            </span>
          </div>
        </div>
      </div>

      {/* Cielo Timeline */}
      <div className="bg-[#11192b] border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Cielo Hop Timeline</span>
          </div>
        </div>

        <div className="space-y-2">
          {incident?.cieloTimeline?.slice(0, 3).map((item, idx) => (
            <div key={idx} className="bg-[#080d17] p-2 rounded border border-slate-800 text-[11px]">
              <div className="text-purple-300 font-mono font-medium">{item.time}</div>
              <div className="font-semibold text-slate-200 mt-0.5">{item.event}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Transfers */}
      <div className="bg-[#11192b] border border-slate-800 rounded-lg p-3">
        <div className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Connected Transfers</span>
        </div>

        <div className="space-y-1.5">
          {incomingTxs.map((tx, idx) => (
            <div key={idx} className="bg-[#080d17] p-1.5 rounded border border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-300 truncate max-w-[140px]">{tx.label}</span>
              </div>
              <span className="text-[9px] font-mono bg-slate-800 px-1 text-slate-400">IN</span>
            </div>
          ))}

          {outgoingTxs.map((tx, idx) => (
            <div key={idx} className="bg-[#080d17] p-1.5 rounded border border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="font-mono text-slate-300 truncate max-w-[140px]">{tx.label}</span>
              </div>
              <span className="text-[9px] font-mono bg-slate-800 px-1 text-slate-400">OUT</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
