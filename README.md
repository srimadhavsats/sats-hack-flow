# Sats Hack Flow ⚡

An all-in-one Smart Contract Hack & Blockchain Forensic Visualizer MVP combining on-chain transaction graphing, bubble maps, cross-chain wallet tracking, contract call trace inspection, and ZachXBT's OSINT investigation suite.

Live Demo & Project Repository: [https://github.com/srimadhavsats/sats-hack-flow](https://github.com/srimadhavsats/sats-hack-flow)

---

## 🔥 Features

- **Chronological Hack Timeline (2016 - 2025)**: Pre-loaded interactive datasets for 20 major smart contract hacks and exploits — from The DAO (2016) and Ronin Bridge to WazirX, Radiant Capital, and the record-breaking **$1.46B Bybit heist (2025)**, the largest crypto theft in history.
- **Interactive Fund Flow Bubble Map**: Powered by Vis.js & Canvas node rendering with bubble sizing proportional to fund volume ($ USD / ETH).
- **Arkham Entity & Cielo Wallet Inspector**: Multi-chain wallet balance inspection, risk scoring, OFAC sanction status, and cross-chain timeline events.
- **MetaSleuth Call Trace Inspector**: Decoded EVM transaction call stack breakdown with vulnerability analysis.
- **ZachXBT OSINT & Breach Intelligence Toolkit**: Integrated query hub for LeakPeek, Snusbase, Intelx, Spur, OSINT Industries, Cavalier (Hudson Rock), Wayback Machine, and Archive.today.
- **Live On-Chain Address Trace**: Paste any Ethereum address to pull **real** chain data — balance, nonce, contract/EOA status, and recent fund flows — via raw **JSON-RPC** (`eth_getBalance` / `eth_getTransactionCount` / `eth_getCode`) plus the keyless Blockscout REST API for entity labels and ENS names. No API key, fully client-side, and the results render in the same forensic bubble-map graph.
- **Custom Sandbox & Obsidian Exporter**: Build custom investigation case files and export to Obsidian Mermaid flowchart markdown format.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/srimadhavsats/sats-hack-flow.git
cd sats-hack-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Lucide React
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Graphing & Visualization**: Vis.js Network, Vis.data, HTML5 Canvas
- **Live Data**: raw JSON-RPC (public Ethereum endpoints) + Blockscout v2 REST API — keyless, client-side
