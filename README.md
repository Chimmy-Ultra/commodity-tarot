<div align="center">

# Commodity Tarot 🃏

### Read the macro through the cards.

**English** · [繁體中文](./README.zh-TW.md)

[![Live Demo](https://img.shields.io/badge/demo-vercel-black?style=flat-square&logo=vercel)](https://commodity-tarot.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev)

![Hero](./docs/screenshots/hero.png)

</div>

---

## ✨ What is this?

A React SPA that maps all **78 tarot cards to commodity market regimes**.
Draw a Past / Present / Future spread and get a narrative reading that interprets the macro environment through the cards.

Not a prediction tool — a **thinking framework**. The cards don't give you answers; they give you perspective.

---

## 🎯 Features

- 🎴 **All 78 cards** with custom commodity-themed AI-generated art
- 🔮 **Three-card spread** (Past / Present / Future) with CSS flip animations
- 📅 **Daily Card** — deterministic per-date, every user globally sees the same card
- 🌏 **Bilingual readings** — English + Traditional Chinese side-by-side
- 🤖 **Optional AI readings** — plug in your Anthropic API key for personalized Claude-generated narratives incorporating live commodity prices
- 🐦 **Share to X/Twitter** — one-click share with card names and macro mappings

---

## 🚀 Live Demo

👉 **[commodity-tarot.vercel.app](https://commodity-tarot.vercel.app)**

---

## 📸 Screenshots

| Three-card spread | Bilingual reading |
|:-:|:-:|
| ![Spread](./docs/screenshots/spread.png) | ![Reading](./docs/screenshots/reading.png) |

---

## 🎴 Card → Market Mapping

### Minor Arcana Suits → Commodity Sectors

| Suit | Sector | Covers |
|------|--------|--------|
| 🔥 **Wands** | Energy | Crude oil, natural gas, power — supply shocks, geopolitics, OPEC dynamics |
| 🪙 **Pentacles** | Metals | Gold, silver, copper, lithium — store of value, industrial demand |
| ☕ **Cups** | Softs | Coffee, cocoa, sugar, cotton — weather cycles, EM consumption |
| 🌾 **Swords** | Grains | Corn, wheat, soybeans, rice — food security, trade wars, logistics |

### Major Arcana → Macro Regimes

| # | Card | Macro Regime |
|---|------|-------------|
| 0 | The Fool | Risk-on / New cycle begins |
| I | The Magician | Central bank omnipotence / Liquidity conjured |
| II | The High Priestess | Hidden information / Price discovery pending |
| III | The Empress | Inflation / Commodity supercycle |
| IV | The Emperor | Rate hikes / Monetary tightening |
| V | The Hierophant | OPEC+ discipline / Cartel orthodoxy |
| VI | The Lovers | Trade agreement / Correlated markets |
| VII | The Chariot | Trend in motion / Momentum trade |
| VIII | Strength | Long-term structural demand / Patient capital |
| IX | The Hermit | Deflation / Low-volatility contraction |
| X | Wheel of Fortune | Supply shock / Cycle turn |
| XI | Justice | Regulatory rebalancing / Market correction |
| XII | The Hanged Man | Recession / Demand destruction |
| XIII | Death | Regime change / End of cycle |
| XIV | Temperance | Soft landing / Managed slowdown |
| XV | The Devil | Leverage / Commodity addiction |
| XVI | The Tower | Volatility spike / Black swan |
| XVII | The Star | Recovery / Liquidity returns |
| XVIII | The Moon | Uncertainty / Sentiment-driven market |
| XIX | The Sun | Global growth / Bull market |
| XX | Judgement | Policy pivot / Fed reversal |
| XXI | The World | Full cycle completion / Peak prosperity |

Full Minor Arcana mapping (56 cards) is defined in [`src/data/arcana.json`](./src/data/arcana.json) — each card has a `macro_mapping`, `keywords`, a `sector`, and Chinese translations (`name_zh`, `macro_mapping_zh`).

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 20+ and npm

### Install & run

```bash
git clone https://github.com/Chimmy-Ultra/commodity-tarot.git
cd commodity-tarot
npm install
npm run dev
```

Opens at <http://localhost:5173>.

### Build for production

```bash
npm run build
npm run preview    # preview the built bundle locally
```

---

## ⚙️ Environment Variables (optional)

Copy `.env.example` to `.env` and fill in any keys you have. Both are **optional** — the app works fully without them, falling back to a bilingual stub reading and a default market snapshot.

| Variable | Purpose | Get a key |
|----------|---------|-----------|
| `VITE_ANTHROPIC_KEY` | Unlocks live Claude-generated narrative readings | [console.anthropic.com](https://console.anthropic.com) |
| `VITE_ALPHA_VANTAGE_KEY` | Fetches live commodity prices to feed into the reading | [alphavantage.co](https://www.alphavantage.co/support/#api-key) |

> ⚠️ These are `VITE_` prefixed, meaning they are **bundled into the client**. Do not use shared production keys — either run your own deployment with your own quota, or have each user paste their key into the UI (not yet implemented).

---

## 🏗️ Architecture

```
 User interaction
      │
      ▼
 CardDraw.jsx / DailyCard.jsx
      │
      ▼
 seedrng.js    ───►  Random shuffle (spread) or date-seeded (daily)
      │
      ▼
 arcana.json  ───►  78 cards × {name, name_zh, macro_mapping,
      │                        macro_mapping_zh, keywords,
      │                        sector, image_prompt}
      ▼
 market.js    ───►  Alpha Vantage live prices (if key present)
      │              · Selects commodities based on drawn cards' sectors
      │              · 4-hour sessionStorage cache
      ▼
 reading.js   ───►  Claude API (if key present) with prompt
      │              = snapshot + 3 cards + keywords
      │              OR bilingual stub narrative (fallback)
      ▼
 Narrative rendered in CardDraw.jsx
```

---

## 📁 Project Structure

```
commodity-tarot/
├── src/
│   ├── App.jsx                  # Hash routing: # / → spread, #/daily → daily card
│   ├── components/
│   │   ├── CardDraw.jsx         # Three-card spread with flip animations
│   │   └── DailyCard.jsx        # Date-seeded daily card view
│   ├── data/
│   │   ├── arcana.json          # All 78 cards with bilingual fields
│   │   └── cardImages.js        # Single source of truth: id → image path
│   └── lib/
│       ├── reading.js           # Claude API + bilingual stub fallback
│       ├── seedrng.js           # Mulberry32 PRNG + Fisher-Yates shuffle
│       └── market.js            # Alpha Vantage integration
├── public/
│   └── cards/                   # 78 card PNG illustrations
├── scripts/
│   ├── generate-images.mjs      # Gemini Imagen 3 batch art generation
│   ├── gen-minor-images.mjs     # Minor-arcana-only helper
│   └── take-screenshots.mjs     # Puppeteer screenshot automation
├── docs/screenshots/            # README imagery
├── vercel.json                  # SPA rewrites for Vercel
└── vite.config.js               # Dev proxies for /api/anthropic + /api/alphavantage
```

---

## 🎨 Regenerating Card Art (for contributors)

The card art was generated via Google Gemini Imagen 3 using the `image_prompt` field on each card in `arcana.json`.

To regenerate (or add new cards):

```bash
# 1. Add a GEMINI_API_KEY to .env
#    (see https://aistudio.google.com/apikey)
# 2. Run:
node scripts/generate-images.mjs --suit wands          # one suit
node scripts/generate-images.mjs --id 42               # single card
node scripts/generate-images.mjs --dry-run             # preview prompts
```

Output is saved to `public/cards/`. The script rate-limits to ~15 RPM to respect the Gemini free tier.

---

## 🚢 Deployment (Vercel — one-click)

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account
2. Click **"Add New Project"** and import your fork of this repo
3. Accept the detected Vite settings — click **Deploy**
4. Every `git push` triggers an auto-redeploy

`vercel.json` handles SPA routing (all paths except `/cards/*` serve `index.html`).

### Optional: enable live readings in production

In Vercel → Project Settings → Environment Variables, add `VITE_ANTHROPIC_KEY` and/or `VITE_ALPHA_VANTAGE_KEY`. **Note the caveat above about bundling.**

---

## 🤝 Contributing

Contributions welcome! Good first issues:

- **Improve card interpretations**: edit `macro_mapping` / `macro_mapping_zh` / `keywords` in [`arcana.json`](./src/data/arcana.json)
- **Better card art**: regenerate any card with a refined `image_prompt`
- **New market snapshots**: extend `src/lib/market.js` to pull in different data sources
- **UI polish**: card animations, mobile layout, dark mode

Fork → branch → commit → PR. Keep PRs focused.

---

## ⚠️ Disclaimer

This is a **conceptual framework and a thinking tool**, not a prediction engine or trading signal.

- The readings are narrative interpretations, not forecasts
- Don't make investment decisions based on cards
- Commodity markets are complex; the mappings here are symbolic, not operational

---

## 📜 License

[MIT](./LICENSE) © Chimmy-Ultra

---

## 🙏 Credits

- **[Claude (Anthropic)](https://anthropic.com)** — narrative generation
- **[Google Gemini Imagen 3](https://ai.google.dev)** — card illustrations
- **[Alpha Vantage](https://www.alphavantage.co)** — commodity price data
- Rider-Waite-Smith tarot structure for the card archetypes
