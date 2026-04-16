# Commodity Tarot

> Read the macro through the cards.

A Vite + React SPA that maps the 78-card tarot deck to commodity market regimes. Draw a past / present / future spread and receive a narrative interpretation powered by Claude.

---

## Major Arcana → Macro Regime Mapping

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

---

## Suit Legend (Minor Arcana)

| Suit | Sector | Theme |
|------|--------|-------|
| Wands | Energy | Oil, gas, power — supply, demand, geopolitics |
| Pentacles | Metals | Gold, silver, copper, lithium — store of value, industry |
| Cups | Softs | Coffee, cocoa, sugar, cotton — weather, EM consumption |
| Swords | Grains | Corn, wheat, soybeans, rice — food security, logistics |

---

## Dev Setup

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_ANTHROPIC_KEY=sk-ant-...
```

Without the key, the reading uses a built-in stub narrative. See `src/lib/reading.js`.

---

## Project Structure

```
src/
├── data/
│   └── arcana.json          # 22 Major Arcana with macro_mapping + image_prompt
├── components/
│   └── CardDraw.jsx         # Past / Present / Future spread with CSS flip animation
├── lib/
│   └── reading.js           # Anthropic API (Claude) narrative stub
└── App.jsx
```

---

## Roadmap

See [open issues](https://github.com/Chimmy-Ultra/commodity-tarot/issues) for planned features.

---

*Out of scope: auth, real trading signals, financial advice.*
