import React, { useState } from 'react';
import { Code, Plus, Trash2, Download, Copy, Check, FileCode, Network, Sparkles } from 'lucide-react';

export default function SandboxEditor({ onAddCustomIncident }) {
  const [caseTitle, setCaseTitle] = useState("Custom Hack Investigation");
  const [nodes, setNodes] = useState([
    { id: "v1", label: "Victim Vault Contract", type: "victim", value: 1000000, address: "0x1111111111111111111111111111111111111111" },
    { id: "h1", label: "Exploiter EOA Wallet", type: "hacker", value: 1000000, address: "0x2222222222222222222222222222222222222222" },
    { id: "m1", label: "Tornado Cash Pool", type: "mixer", value: 500000, address: "0x3333333333333333333333333333333333333333" }
  ]);

  const [edges, setEdges] = useState([
    { from: "v1", to: "h1", label: "$1,000,000 ETH", value: 1000000, token: "ETH", txHash: "0xabc...123" },
    { from: "h1", to: "m1", label: "$500,000 ETH", value: 500000, token: "ETH", txHash: "0xdef...456" }
  ]);

  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeType, setNewNodeType] = useState("hacker");
  const [newNodeVal, setNewNodeVal] = useState("500000");

  const [edgeFrom, setEdgeFrom] = useState("v1");
  const [edgeTo, setEdgeTo] = useState("h1");
  const [edgeLabel, setEdgeLabel] = useState("$500,000 USDC");

  const [copiedMermaid, setCopiedMermaid] = useState(false);

  // Generate a realistic-length hex string (Math.random().toString(16) only yields ~13 chars).
  const randomHex = (len) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const handleAddNode = (e) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;

    const newId = `node_${Date.now()}`;
    const nodeObj = {
      id: newId,
      label: newNodeLabel,
      type: newNodeType,
      value: Number(newNodeVal) || 100000,
      entity: newNodeType.toUpperCase(),
      chain: "Ethereum",
      address: `0x${randomHex(40)}`
    };

    setNodes([...nodes, nodeObj]);
    setNewNodeLabel("");
  };

  const handleAddEdge = (e) => {
    e.preventDefault();
    if (!edgeFrom || !edgeTo || edgeFrom === edgeTo) return;

    const newEdge = {
      from: edgeFrom,
      to: edgeTo,
      label: edgeLabel || "Transfer",
      value: 100000,
      token: "ETH",
      txHash: `0x${randomHex(64)}`,
      timestamp: new Date().toISOString()
    };

    setEdges([...edges, newEdge]);
  };

  const handleRemoveNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.from !== id && e.to !== id));
  };

  // Generate Obsidian Mermaid Diagram Markdown
  const generateMermaidCode = () => {
    let mermaid = `\`\`\`mermaid\nflowchart TD\n`;
    nodes.forEach(n => {
      const shape = n.type === 'hacker' ? `[("${n.label}")]` : `["${n.label}"]`;
      mermaid += `    ${n.id}${shape}\n`;
    });
    edges.forEach(e => {
      mermaid += `    ${e.from} -- "${e.label}" --> ${e.to}\n`;
    });
    mermaid += `\`\`\``;
    return mermaid;
  };

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(generateMermaidCode());
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const handleLoadIntoVisualizer = () => {
    const customIncidentObj = {
      id: `custom_${Date.now()}`,
      name: caseTitle,
      year: new Date().getFullYear(),
      date: new Date().toLocaleDateString(),
      totalStolen: nodes.reduce((sum, n) => sum + (n.value || 0), 0),
      stolenFormatted: `$${(nodes.reduce((sum, n) => sum + (n.value || 0), 0) / 1000000).toFixed(1)} Million`,
      victim: "Custom Target",
      attackVector: "Custom Case Investigation",
      chains: ["Ethereum"],
      status: "Active Tracking",
      hackerEntity: "Unattributed Hacker",
      description: "User-defined custom sandbox investigation diagram.",
      nodes: nodes.map(n => ({
        ...n,
        entity: n.type.toUpperCase()
      })),
      edges: edges,
      callTrace: [
        { step: 1, depth: 0, contract: "CustomContract", function: "exploit()", status: "EXPLOITED", value: "Custom" }
      ],
      cieloTimeline: [
        { time: new Date().toISOString(), event: "Custom Case Created", chain: "Ethereum", detail: "Graph built in ChainSleuth Sandbox" }
      ]
    };

    onAddCustomIncident(customIncidentObj);
  };

  return (
    <div className="bg-[#070b14] border border-slate-800/90 rounded-2xl p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Code className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Custom Case Builder & Obsidian Exporter
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Construct interactive fund flow bubble maps and export directly to Obsidian Mermaid markdown
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadIntoVisualizer}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>Load Case into Visualizer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Form Controls */}
        <div className="space-y-6">
          
          {/* Case Name */}
          <div className="bg-[#0e1628] border border-slate-800 p-4 rounded-xl space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Investigation Title</label>
            <input
              type="text"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          {/* Add Node Form */}
          <div className="bg-[#0e1628] border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add Node / Wallet Entity</span>
            </h4>

            <form onSubmit={handleAddNode} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400">Node Label Name:</label>
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="e.g. Hacker CEX Deposit Wallet"
                  className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Entity Type:</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value)}
                    className="w-full bg-[#080d17] border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1.5 mt-1"
                  >
                    <option value="hacker">🛑 Hacker / Exploiter</option>
                    <option value="victim">🔵 Victim Vault</option>
                    <option value="mixer">🟣 Privacy Mixer</option>
                    <option value="bridge">🌉 Bridge / DEX</option>
                    <option value="cex">🟢 CEX Deposit</option>
                    <option value="hop">⚪ Hop Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Volume ($ USD):</label>
                  <input
                    type="number"
                    value={newNodeVal}
                    onChange={(e) => setNewNodeVal(e.target.value)}
                    className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-1.5 rounded-lg border border-slate-700 transition"
              >
                + Add Entity Node
              </button>
            </form>
          </div>

          {/* Add Edge Transfer Form */}
          <div className="bg-[#0e1628] border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-4 h-4" />
              <span>Connect Transaction Transfer (Edge)</span>
            </h4>

            <form onSubmit={handleAddEdge} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">From Node:</label>
                  <select
                    value={edgeFrom}
                    onChange={(e) => setEdgeFrom(e.target.value)}
                    className="w-full bg-[#080d17] border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1.5 mt-1"
                  >
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">To Node:</label>
                  <select
                    value={edgeTo}
                    onChange={(e) => setEdgeTo(e.target.value)}
                    className="w-full bg-[#080d17] border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1.5 mt-1"
                  >
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Tx Label Amount:</label>
                <input
                  type="text"
                  value={edgeLabel}
                  onChange={(e) => setEdgeLabel(e.target.value)}
                  placeholder="e.g. 500 ETH ($1.2M)"
                  className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 mt-1 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-1.5 rounded-lg border border-slate-700 transition"
              >
                + Connect Transfer Edge
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Node List & Obsidian Export */}
        <div className="space-y-6">
          
          {/* Active Nodes List */}
          <div className="bg-[#0e1628] border border-slate-800 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Case Nodes ({nodes.length})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {nodes.map(n => (
                <div key={n.id} className="bg-[#080d17] border border-slate-800 p-2 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      n.type === 'hacker' ? 'bg-red-500' : n.type === 'victim' ? 'bg-cyan-400' : 'bg-purple-500'
                    }`}></span>
                    <span className="font-semibold text-slate-200">{n.label}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveNode(n.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Obsidian Mermaid Export Box */}
          <div className="bg-[#0e1628] border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>Obsidian Mermaid Diagram Export</span>
              </div>

              <button
                onClick={handleCopyMermaid}
                className="bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs px-3 py-1 rounded-lg transition flex items-center gap-1.5"
              >
                {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMermaid ? 'Copied Code!' : 'Copy Mermaid Code'}</span>
              </button>
            </div>

            <pre className="bg-[#060912] border border-slate-800 p-3 rounded-lg text-[11px] font-mono text-purple-300 overflow-x-auto max-h-56">
              {generateMermaidCode()}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
}
