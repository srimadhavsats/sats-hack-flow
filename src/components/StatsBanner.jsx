import React from 'react';
import { DollarSign, ShieldAlert, AlertTriangle, UserCheck, GitBranch } from 'lucide-react';

export default function StatsBanner({ incident }) {
  if (!incident) return null;

  const getStatusBadgeClass = (status) => {
    if (status.includes("100% Funds Returned") || status.includes("Recovered")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    if (status.includes("Frozen") || status.includes("Seized")) {
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
    if (status.includes("Sanctioned") || status.includes("Prosecution")) {
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    }
    return "bg-red-500/10 text-red-400 border-red-500/30";
  };

  return (
    <div className="bg-[#0c1322] border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Hack Title & Quick Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white font-heading">{incident.name}</h2>
              <span className="text-xs font-mono text-slate-400">({incident.date})</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getStatusBadgeClass(incident.status)}`}>
                {incident.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl truncate">
              {incident.description.split('.')[0]}.
            </p>
          </div>
        </div>

        {/* Right: Crisp Metrics Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Stolen Metric */}
          <div className="bg-[#121b2e] border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Stolen</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">{incident.stolenFormatted}</div>
            </div>
          </div>

          {/* Vector Metric */}
          <div className="bg-[#121b2e] border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Vector</div>
              <div className="text-xs font-semibold text-slate-200">{incident.attackVector}</div>
            </div>
          </div>

          {/* Hacker Entity */}
          <div className="bg-[#121b2e] border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Entity</div>
              <div className="text-xs font-mono font-medium text-cyan-300 truncate max-w-[140px]">
                {incident.hackerEntity.split('(')[0]}
              </div>
            </div>
          </div>

          {/* Chain Footprint */}
          <div className="bg-[#121b2e] border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Chains</div>
              <div className="flex items-center gap-1">
                {incident.chains.slice(0, 2).map((c, i) => (
                  <span key={i} className="text-[9px] font-mono text-purple-300 bg-purple-950 px-1 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
