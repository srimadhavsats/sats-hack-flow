# Sats Hack Flow ⚡

### 🌐 [Live Demo → srimadhavsats.github.io/sats-hack-flow](https://srimadhavsats.github.io/sats-hack-flow/)

> An all-in-one **Smart Contract Hack & Blockchain Forensic Visualizer** — combining on-chain transaction graphing, bubble maps, cross-chain wallet tracking, contract call trace inspection, and ZachXBT's OSINT investigation suite.

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://srimadhavsats.github.io/sats-hack-flow/)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🔥 Features

### 📅 Chronological Hack Timeline (2016 – 2025)
Pre-loaded interactive datasets for **20 major smart contract hacks and exploits** — from The DAO (2016) and Ronin Bridge to WazirX, Radiant Capital, and the record-breaking **$1.46B Bybit heist (2025)**, the largest crypto theft in history.

### 🫧 Interactive Fund Flow Bubble Map
Powered by **Vis.js & HTML5 Canvas** node rendering with bubble sizing proportional to fund volume ($ USD / ETH). Drag, zoom, and click nodes to follow the money trail across wallets and contracts.

### 🔎 Arkham Entity & Cielo Wallet Inspector
Multi-chain wallet balance inspection, risk scoring, OFAC sanction status, and cross-chain timeline events.

### 🧬 MetaSleuth Call Trace Inspector
Decoded EVM transaction call stack breakdown with vulnerability analysis — view every internal call, delegate call, and state change in a structured tree view.

### 🕵️ ZachXBT OSINT & Breach Intelligence Toolkit
Integrated query hub for:
- **LeakPeek** & **Snusbase** — credential breach search
- **Intelx** — intelligence search engine
- **Spur** — IP context & VPN/proxy detection
- **OSINT Industries** — email & phone OSINT
- **Cavalier (Hudson Rock)** — infostealer intelligence
- **Wayback Machine** & **Archive.today** — web archival lookup

### ⛓️ Live On-Chain Address Trace
Paste any Ethereum address to pull **real chain data** — balance, nonce, contract/EOA status, and recent fund flows — via raw **JSON-RPC** (`eth_getBalance` / `eth_getTransactionCount` / `eth_getCode`) plus the keyless **Blockscout v2 REST API** for entity labels and ENS names. No API key required, fully client-side.

### 📝 Custom Sandbox & Obsidian Exporter
Build custom investigation case files and export to **Obsidian Mermaid flowchart** markdown format for offline analysis and note-taking.

---

## 📸 Screenshots

> _Visit the [live demo](https://srimadhavsats.github.io/sats-hack-flow/) to explore all features interactively._

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

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

Open [http://localhost:5173](http://localhost:5173) in your browser (Vite default port).

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture

```
sats-hack-flow/
├── .github/workflows/    # GitHub Pages CI/CD deployment
├── src/
│   ├── components/
│   │   ├── BubbleMapGraph.jsx    # Vis.js fund flow bubble map
│   │   ├── CallTraceView.jsx     # EVM call trace tree
│   │   ├── EntityInspector.jsx   # Arkham/Cielo wallet inspector
│   │   ├── LiveTrace.jsx         # Live on-chain address tracer
│   │   ├── Navbar.jsx            # Navigation & incident selector
│   │   ├── OsintToolkit.jsx      # ZachXBT OSINT tool suite
│   │   ├── SandboxEditor.jsx     # Custom case file editor
│   │   └── StatsBanner.jsx       # Dashboard stats overview
│   ├── data/
│   │   ├── incidents.js          # 20 pre-loaded hack datasets
│   │   ├── liveApi.js            # JSON-RPC & Blockscout API layer
│   │   └── osintTools.js         # OSINT tool configurations
│   ├── App.jsx                   # Root application component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS v4 config
├── package.json
└── requirements.txt              # Python dependencies (auxiliary)
```

---

## 🛠️ Tech Stack

| Layer              | Technology                                          |
| :----------------- | :-------------------------------------------------- |
| **Framework**      | React 18, Vite 5                                    |
| **Styling**        | Tailwind CSS v4, Vanilla CSS                        |
| **Visualization**  | Vis.js Network, Vis-data, HTML5 Canvas              |
| **Icons**          | Lucide React                                        |
| **Live Data**      | Raw JSON-RPC (public Ethereum RPC) + Blockscout v2  |
| **Deployment**     | GitHub Pages via GitHub Actions CI/CD               |

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

---

<p align="center">
  Built with ⚡ by <a href="https://github.com/srimadhavsats">@srimadhavsats</a>
</p>
