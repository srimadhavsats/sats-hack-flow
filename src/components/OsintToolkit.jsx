import React, { useState } from 'react';
import { OSINT_TOOLS } from '../data/osintTools';
import { Globe, Search, ShieldAlert, Key, Database, UserCheck, Cpu, Archive, ExternalLink, FileCode, CheckCircle, Terminal, RefreshCw } from 'lucide-react';

export default function OsintToolkit({ incident }) {
  const [selectedTool, setSelectedTool] = useState('all');
  const [queryInput, setQueryInput] = useState('');
  const [queryType, setQueryType] = useState('email'); // email, phone, username, ip, hash, address
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSimulateSearch = (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults({
        query: queryInput,
        type: queryType,
        timestamp: new Date().toISOString(),
        breachesFound: 3,
        hits: [
          {
            source: 'Intelx.io / Pastebin Index',
            detail: `Found match for ${queryInput} in darknet leak database. Included in breach log 'CryptoLocker_Mule_List_2023.txt'`,
            risk: 'HIGH'
          },
          {
            source: 'LeakPeek Credential DB',
            detail: `Associated hash linked to admin user 'exploiter_dev99'. Last observed password hash (SHA256).`,
            risk: 'CRITICAL'
          },
          {
            source: 'Hudson Rock (Cavalier)',
            detail: `Infostealer log entry matched IP address / domain. Device ID: PC-WIN10-VICTIM-09. Malicious Trojan: RedLine Stealer.`,
            risk: 'HIGH'
          },
          {
            source: 'OSINT Industries Correlation',
            detail: `Identified registered accounts across Telegram (@lazarus_mule_admin), GitHub, and ProtonMail.`,
            risk: 'MEDIUM'
          }
        ]
      });
    }, 600);
  };

  const getDirectQueryUrl = (toolId, query) => {
    const encoded = encodeURIComponent(query || '0x0000000000000000000000000000000000000000');
    switch (toolId) {
      case 'intelx':
        return `https://intelx.io/?s=${encoded}`;
      case 'leakpeek':
        return `https://leakpeek.com/search?q=${encoded}`;
      case 'wayback':
        return `https://web.archive.org/web/*/${encoded}`;
      case 'hudson_rock':
        return `https://www.hudsonrock.com/search?q=${encoded}`;
      case 'arkham':
        return `https://platform.arkhamintelligence.com/explorer/address/${encoded}`;
      case 'cielo':
        return `https://cielo.finance/homedash?search=${encoded}`;
      case 'metasleuth':
        return `https://metasleuth.io/result/eth/${encoded}`;
      default:
        return OSINT_TOOLS.find(t => t.id === toolId)?.url || '#';
    }
  };

  const filteredTools = selectedTool === 'all'
    ? OSINT_TOOLS
    : OSINT_TOOLS.filter(t => t.category.toLowerCase().includes(selectedTool.toLowerCase()));

  return (
    <div className="bg-[#070b14] border border-slate-800/90 rounded-2xl p-6 flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              ZachXBT Investigation & OSINT Toolkit Hub
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated breach databases, infostealer logs, identity correlation, and block visualizers
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-[#101728] p-1 rounded-lg border border-slate-800 overflow-x-auto">
          {['all', 'on-chain', 'breach', 'identity', 'archiving'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedTool(cat)}
              className={`px-3 py-1 rounded text-xs font-semibold capitalize transition ${
                selectedTool === cat
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive OSINT Query Simulator Form */}
      <div className="bg-gradient-to-r from-[#0d1424] via-[#10192e] to-[#0d1424] border border-purple-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-purple-300 font-heading uppercase tracking-wider">
            Multi-Database OSINT Query Console (ZachXBT Toolkit)
          </h4>
        </div>

        <form onSubmit={handleSimulateSearch} className="flex flex-wrap items-center gap-3">
          {/* Query Type Dropdown */}
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="bg-[#080d17] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="email">Email Address</option>
            <option value="username">Username / Handle</option>
            <option value="address">Crypto Wallet / Hash</option>
            <option value="ip">IP Address</option>
            <option value="phone">Phone Number</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={`Enter target ${queryType} (e.g. 0x098b7142e110, hacker@lazarus.org)...`}
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Run Query Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-5 py-2 rounded-lg transition flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Run OSINT Sweep</span>
          </button>
        </form>

        {/* Live Search Output Drawer */}
        {searchResults && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 animate-fadeIn">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-200 font-mono">
                Sweep Results for: <span className="text-purple-300">{searchResults.query}</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 font-mono">
                {searchResults.hits.length} Threat Matches Found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.hits.map((hit, idx) => (
                <div key={idx} className="bg-[#070b14] border border-slate-800 p-3 rounded-lg flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                      <span>{hit.source}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{hit.detail}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    hit.risk === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {hit.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid of OSINT & Tracing Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-[#0b101d] border border-slate-800/90 hover:border-purple-500/50 rounded-xl p-4 transition flex flex-col justify-between group hover:shadow-lg hover:shadow-purple-950/30"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-purple-400 font-mono bg-purple-950/70 px-2 py-0.5 rounded border border-purple-900/50">
                  {tool.category}
                </span>
                <a
                  href={getDirectQueryUrl(tool.id, queryInput)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-300 transition p-1"
                  title={`Open ${tool.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h4 className="text-sm font-bold text-white font-heading group-hover:text-purple-300 transition">
                {tool.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Features Tags & Direct Launcher */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 2).map((feat, i) => (
                  <span key={i} className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded">
                    {feat}
                  </span>
                ))}
              </div>
              
              <a
                href={getDirectQueryUrl(tool.id, queryInput)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0"
              >
                <span>Query</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
