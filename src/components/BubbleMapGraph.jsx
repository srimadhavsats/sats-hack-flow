import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Play, Pause, RefreshCw, ZoomIn, ZoomOut, Filter } from 'lucide-react';

export default function BubbleMapGraph({ incident, onSelectNode, selectedNodeId }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesDataSetRef = useRef(null);
  const edgesDataSetRef = useRef(null);

  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [minValueFilter, setMinValueFilter] = useState(0);
  const [activeEntityFilters, setActiveEntityFilters] = useState({
    hacker: true,
    victim: true,
    mixer: true,
    bridge: true,
    cex: true,
    hop: true
  });

  // Calculate Node Color based on Entity Type
  const getNodeStyles = (nodeType) => {
    switch (nodeType) {
      case 'hacker':
        return { background: '#ef4444', border: '#f87171' };
      case 'victim':
        return { background: '#06b6d4', border: '#38bdf8' };
      case 'mixer':
        return { background: '#a855f7', border: '#c084fc' };
      case 'bridge':
        return { background: '#ec4899', border: '#f472b6' };
      case 'cex':
        return { background: '#10b981', border: '#34d399' };
      default: // hop
        return { background: '#475569', border: '#94a3b8' };
    }
  };

  const getNodeSize = (val) => {
    if (!val || val <= 0) return 24;
    const logVal = Math.log10(val + 1);
    return Math.max(24, Math.min(65, logVal * 7.5));
  };

  // Initialize Network Canvas once per incident / filter change
  useEffect(() => {
    if (!containerRef.current || !incident) return;

    // Filter nodes and edges according to controls
    const filteredNodes = incident.nodes.filter(node => {
      const passesEntityFilter = activeEntityFilters[node.type] !== false;
      const passesValueFilter = node.value >= minValueFilter;
      return passesEntityFilter && passesValueFilter;
    });

    const allowedNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredEdges = incident.edges.filter(edge => 
      allowedNodeIds.has(edge.from) && allowedNodeIds.has(edge.to)
    );

    // Formatted Vis.js Nodes
    const visNodes = filteredNodes.map(node => {
      const styles = getNodeStyles(node.type);
      const isSelected = selectedNodeId === node.id;

      return {
        id: node.id,
        label: node.label,
        size: getNodeSize(node.value),
        shape: 'dot',
        color: isSelected
          ? { background: '#f59e0b', border: '#ffffff', highlight: { background: '#f59e0b', border: '#ffffff' } }
          : { background: styles.background, border: styles.border, highlight: { background: styles.background, border: '#ffffff' } },
        font: { color: '#f8fafc', face: 'JetBrains Mono', size: 11, bold: true },
        borderWidth: isSelected ? 4 : 2,
        shadow: {
          enabled: true,
          color: styles.background,
          size: node.type === 'hacker' ? 18 : 8,
          x: 0,
          y: 0
        }
      };
    });

    // Formatted Vis.js Edges
    const visEdges = filteredEdges.map(edge => ({
      id: `${edge.from}-${edge.to}`,
      from: edge.from,
      to: edge.to,
      label: edge.label,
      font: { color: '#94a3b8', face: 'JetBrains Mono', size: 10, strokeWidth: 2, strokeColor: '#070b14' },
      color: { color: '#334155', highlight: '#06b6d4' },
      width: Math.max(1.5, Math.min(5, Math.log10(edge.value + 1))),
      arrows: { to: { enabled: true, scaleFactor: 0.7 } },
      smooth: { type: 'cubicBezier', roundness: 0.4 }
    }));

    const nodesDataSet = new DataSet(visNodes);
    const edgesDataSet = new DataSet(visEdges);

    nodesDataSetRef.current = nodesDataSet;
    edgesDataSetRef.current = edgesDataSet;

    const options = {
      nodes: {
        borderWidthSelected: 4,
        shadow: true
      },
      edges: {
        shadow: true
      },
      physics: {
        enabled: physicsEnabled,
        barnesHut: {
          gravitationalConstant: -3500,
          centralGravity: 0.25,
          springLength: 130,
          springConstant: 0.04,
          damping: 0.09
        }
      },
      interaction: {
        hover: false, // Disabled native hover tooltip to prevent canvas destruction on hover
        zoomView: true,
        dragView: true,
        selectable: true
      }
    };

    const network = new Network(
      containerRef.current,
      { nodes: nodesDataSet, edges: edgesDataSet },
      options
    );

    networkRef.current = network;

    // Handle node selection on click
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const clickedNode = incident.nodes.find(n => n.id === nodeId);
        if (clickedNode && onSelectNode) {
          onSelectNode(clickedNode);
        }
      }
    });

    return () => {
      network.destroy();
    };
  }, [incident, physicsEnabled, minValueFilter, activeEntityFilters]);

  // Update selection highlight without destroying network
  useEffect(() => {
    if (networkRef.current && selectedNodeId) {
      try {
        networkRef.current.selectNodes([selectedNodeId]);
      } catch (err) {
        // ignore if node not visible
      }
    }
  }, [selectedNodeId]);

  const togglePhysics = () => {
    const nextState = !physicsEnabled;
    setPhysicsEnabled(nextState);
    if (networkRef.current) {
      networkRef.current.setOptions({ physics: { enabled: nextState } });
    }
  };

  const handleZoomIn = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale * 1.3 });
    }
  };

  const handleZoomOut = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale / 1.3 });
    }
  };

  const handleResetZoom = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
    }
  };

  const toggleEntityFilter = (type) => {
    setActiveEntityFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="relative w-full h-full min-h-[620px] bg-[#070b14] rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
      
      {/* Graph Controls Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-[#0e172a]/95 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-xl">
        
        <button
          onClick={togglePhysics}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            physicsEnabled
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          {physicsEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{physicsEnabled ? 'Pause Physics' : 'Enable Layout'}</span>
        </button>

        <div className="flex items-center gap-1 bg-[#141e33] p-1 rounded-lg border border-slate-800">
          <button onClick={handleZoomIn} title="Zoom In" className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} title="Zoom Out" className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleResetZoom} title="Reset View" className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-2 border-l border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Min Vol:</span>
          <input
            type="range"
            min="0"
            max="1000000"
            step="50000"
            value={minValueFilter}
            onChange={(e) => setMinValueFilter(Number(e.target.value))}
            className="w-24 accent-cyan-500 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-cyan-400 font-bold">
            {minValueFilter > 0 ? `$${(minValueFilter / 1000).toFixed(0)}k+` : 'All'}
          </span>
        </div>

      </div>

      {/* Legend Filters (Top Right) */}
      <div className="absolute top-4 right-4 z-10 bg-[#0e172a]/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-xl hidden lg:block max-w-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
          <Filter className="w-3 h-3 text-cyan-400" />
          Bubble Map Entity Filter
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => toggleEntityFilter('hacker')}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition border ${
              activeEntityFilters.hacker
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Exploiter EOA</span>
          </button>

          <button
            onClick={() => toggleEntityFilter('victim')}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition border ${
              activeEntityFilters.victim
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Victim Vault</span>
          </button>

          <button
            onClick={() => toggleEntityFilter('mixer')}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition border ${
              activeEntityFilters.mixer
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Privacy Mixer</span>
          </button>

          <button
            onClick={() => toggleEntityFilter('bridge')}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition border ${
              activeEntityFilters.bridge
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
            <span>Bridge / DEX</span>
          </button>

          <button
            onClick={() => toggleEntityFilter('cex')}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition border ${
              activeEntityFilters.cex
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>CEX Deposit</span>
          </button>

          <button
            onClick={() => toggleEntityFilter('hop')}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition border ${
              activeEntityFilters.hop
                ? 'bg-slate-700 text-slate-200 border-slate-600'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>Hop Wallet</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '620px', minHeight: '620px', backgroundColor: '#070b14' }}
      />

      {/* Footer Info */}
      <div className="bg-[#090e1a] border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Click any node bubble to inspect address details & Cielo timeline in the side panel.</span>
        </div>
        <div className="font-mono text-slate-500">
          Nodes: {incident.nodes.length} | Transfers: {incident.edges.length}
        </div>
      </div>

    </div>
  );
}
