import React from 'react';
import { Shield, Filter, Search, Network, Layers, Wallet, Globe, Code, Radar } from 'lucide-react';
import { YEARS } from '../data/incidents';

export default function Navbar({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  selectedYear,
  onSelectYear,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange
}) {
  return (
    <header className="bg-[#0b101d] border-b border-slate-800 sticky top-0 z-50">
      {/* Top Header */}
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white font-heading tracking-wide">Sats Hack Flow</h1>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono px-1.5 py-0.2 rounded uppercase">
                Forensic MVP
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Smart Contract Hack & Cross-Chain Visualizer</p>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="relative flex-1 max-w-xs hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search hacks (e.g. DAO, Ronin, 0x838f)..."
            className="w-full bg-[#121a2d] border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* View Mode Nav Tabs */}
        <div className="flex items-center gap-1 bg-[#080c15] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onTabChange('graph')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'graph'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Fund Flow Map</span>
          </button>

          <button
            onClick={() => onTabChange('live')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'live'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Trace</span>
          </button>

          <button
            onClick={() => onTabChange('inspector')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'inspector'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Entity Inspector</span>
          </button>

          <button
            onClick={() => onTabChange('trace')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'trace'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Call Trace</span>
          </button>

          <button
            onClick={() => onTabChange('osint')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'osint'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>OSINT Toolkit</span>
          </button>

          <button
            onClick={() => onTabChange('sandbox')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'sandbox'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Custom Sandbox</span>
          </button>
        </div>

      </div>

      {/* Year Filter & Incident Selector Bar */}
      <div className="bg-[#080d18] border-t border-slate-800 px-4 py-1.5">
        <div className="max-w-[1700px] mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
          
          {/* Year Pills */}
          <div className="flex items-center gap-1 bg-[#101728] p-0.5 rounded border border-slate-800 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 px-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              Year:
            </span>
            {YEARS.map(year => {
              const isSel = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => onSelectYear(year)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    isSel
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>

          {/* Incident Chronological Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
            {incidents.map(inc => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <button
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/60 font-bold'
                      : 'bg-[#121929] text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-[9px] text-cyan-400 bg-cyan-950 px-1 rounded">
                    {inc.year}
                  </span>
                  <span>{inc.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {inc.stolenFormatted.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
}
