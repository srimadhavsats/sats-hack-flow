import React, { useState, useMemo } from 'react';
import { INCIDENTS } from './data/incidents';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import BubbleMapGraph from './components/BubbleMapGraph';
import EntityInspector from './components/EntityInspector';
import CallTraceView from './components/CallTraceView';
import OsintToolkit from './components/OsintToolkit';
import SandboxEditor from './components/SandboxEditor';

export default function App() {
  const [incidentsList, setIncidentsList] = useState(INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState("dao-hack-2016");
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("graph");
  const [selectedNode, setSelectedNode] = useState(null);

  // Filter incidents chronologically and by year / search query
  const filteredIncidents = useMemo(() => {
    return incidentsList
      .filter(inc => {
        const matchesYear = selectedYear === "All" || inc.year === selectedYear;
        const matchesQuery = !searchQuery || 
          inc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.victim.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.hackerEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.attackVector.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesYear && matchesQuery;
      })
      .sort((a, b) => a.year - b.year); // Ensure chronological order
  }, [incidentsList, selectedYear, searchQuery]);

  // Active Incident Object
  const activeIncident = useMemo(() => {
    return incidentsList.find(i => i.id === selectedIncidentId) || filteredIncidents[0] || incidentsList[0];
  }, [incidentsList, selectedIncidentId, filteredIncidents]);

  const handleAddCustomIncident = (customIncident) => {
    setIncidentsList(prev => [customIncident, ...prev]);
    setSelectedIncidentId(customIncident.id);
    setActiveTab("graph");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans">
      
      {/* Navbar with Chronological Tabs & Year Filter */}
      <Navbar
        incidents={filteredIncidents}
        selectedIncidentId={activeIncident?.id}
        onSelectIncident={(id) => {
          setSelectedIncidentId(id);
          setSelectedNode(null);
        }}
        selectedYear={selectedYear}
        onSelectYear={(yr) => setSelectedYear(yr)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Case Metrics & Incident Overview Banner */}
      <StatsBanner incident={activeIncident} />

      {/* Main View Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 flex flex-col gap-6">
        
        {/* TAB 1: Fund Flow Map & Bubble Graph + Inspector Side Panel */}
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[620px]">
            {/* Center/Left: TRM/MetaSleuth Bubble Map Canvas */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
              <BubbleMapGraph
                incident={activeIncident}
                selectedNodeId={selectedNode?.id}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            </div>

            {/* Right: Arkham / Cielo Entity Inspector */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
              <EntityInspector
                selectedNode={selectedNode}
                incident={activeIncident}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Standalone Entity Inspector */}
        {activeTab === 'inspector' && (
          <div className="max-w-4xl mx-auto w-full">
            <EntityInspector
              selectedNode={selectedNode}
              incident={activeIncident}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>
        )}

        {/* TAB 3: MetaSleuth Call Trace Inspector */}
        {activeTab === 'trace' && (
          <div className="w-full max-w-5xl mx-auto">
            <CallTraceView incident={activeIncident} />
          </div>
        )}

        {/* TAB 4: ZachXBT OSINT & Breach Toolkit */}
        {activeTab === 'osint' && (
          <div className="w-full">
            <OsintToolkit incident={activeIncident} />
          </div>
        )}

        {/* TAB 5: Custom Sandbox Case Builder */}
        {activeTab === 'sandbox' && (
          <div className="w-full">
            <SandboxEditor onAddCustomIncident={handleAddCustomIncident} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#060912] border-t border-slate-800/80 px-4 py-3 text-center text-xs text-slate-500 font-mono">
        ChainSleuth Forensic Visualizer MVP — ZachXBT Toolkit Suite | 2016-2024 Historical Dataset
      </footer>

    </div>
  );
}
