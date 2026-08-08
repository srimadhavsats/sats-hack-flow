import React from 'react';
import { Layers, AlertTriangle, CheckCircle, XCircle, ArrowRightLeft, Code, FileCode2 } from 'lucide-react';

export default function CallTraceView({ incident }) {
  if (!incident || !incident.callTrace) {
    return (
      <div className="bg-[#0b111e] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-xs">No call trace data available for this incident.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> SUCCESS</span>;
      case 'REENTER':
      case 'EXPLOITED':
      case 'MANIPULATED':
      case 'UNAUTHORIZED':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" /> {status}</span>;
      case 'DRAINED':
      case 'DESTROYED':
      case 'MINTED':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1"><Layers className="w-3 h-3" /> {status}</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">{status}</span>;
    }
  };

  return (
    <div className="bg-[#070b14] border border-slate-800/90 rounded-2xl p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800/90 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              MetaSleuth Smart Contract Call Trace — {incident.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Decoded EVM transaction call stack, internal calls, and vulnerability triggers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-[#0e1628] px-3 py-1 rounded-lg border border-slate-800">
            Target Vector: <span className="text-cyan-400 font-semibold">{incident.attackVector}</span>
          </span>
        </div>
      </div>

      {/* Exploit Vector Explanation Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-purple-950/20 to-[#0c1424] border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h4 className="text-xs font-bold text-red-300 font-mono uppercase tracking-wider">Vulnerability Mechanism</h4>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">{incident.description}</p>
        </div>
      </div>

      {/* Call Stack Trace Tree */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>Execution Call Hierarchy</span>
        </div>

        <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 space-y-3 font-mono">
          {incident.callTrace.map((step, idx) => (
            <div
              key={idx}
              style={{ marginLeft: `${step.depth * 24}px` }}
              className={`p-3 rounded-lg border transition ${
                step.status === 'REENTER' || step.status === 'EXPLOITED' || step.status === 'MANIPULATED'
                  ? 'bg-red-950/30 border-red-500/50 shadow-md shadow-red-950/50'
                  : 'bg-[#101828] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-900">
                    #{step.step}
                  </span>
                  <span className="text-xs text-cyan-300 font-bold">{step.contract}</span>
                  <span className="text-xs text-slate-400">→</span>
                  <span className="text-xs font-bold text-slate-100">{step.function}</span>
                </div>

                <div className="flex items-center gap-3">
                  {step.value && (
                    <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50">
                      Val: {step.value}
                    </span>
                  )}
                  {getStatusBadge(step.status)}
                </div>
              </div>

              {/* Exploit Note */}
              {step.note && (
                <div className="mt-2 text-xs text-slate-300 font-sans bg-[#080d16] p-2 rounded border border-slate-800/60">
                  <span className="font-semibold text-slate-400">Analysis: </span>
                  {step.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
