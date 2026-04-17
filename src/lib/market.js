/**
 * market.js — Live commodity price snapshot for narrative readings.
 *
 * Uses Alpha Vantage free tier (25 req/day). Set VITE_ALPHA_VANTAGE_KEY in .env.
 * Falls back to DEFAULT_SNAPSHOT from reading.js if key is missing or fetch fails.
 * Caches results in sessionStorage for 4 hours to conserve API quota.
 */

import { DEFAULT_SNAPSHOT } from './reading'

const CACHE_KEY = 'commodity_snapshot'
const CACHE_TTL_MS = 4 * 60 * 60 * 1000 // 4 hours

// Sector → commodity symbols for Alpha Vantage COMMODITIES function
const SECTOR_COMMODITIES = {
  Energy:    [{ fn: 'WTI', label: 'WTI Crude' }, { fn: 'NATURAL_GAS', label: 'Natural Gas' }],
  Metals:    [{ fn: 'COPPER', label: 'Copper' }],
  Softs:     [{ fn: 'COFFEE', label: 'Coffee' }, { fn: 'SUGAR', label: 'Sugar' }],
  Grains:    [{ fn: 'CORN', label: 'Corn' }, { fn: 'WHEAT', label: 'Wheat' }],
}

// Always include gold as benchmark
const GOLD_QUERY = { fn: 'GOLD', label: 'Gold' }

/**
 * Fetch a single commodity's latest monthly price from Alpha Vantage.
 * Returns null on failure.
 */
async function fetchCommodityPrice(fn, apiKey) {
  try {
    const url = `/api/alphavantage/query?function=${fn}&interval=monthly&apikey=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    // Alpha Vantage COMMODITIES returns { data: [{ date, value }, ...] }
    const latest = data?.data?.[0]
    if (!latest?.value || latest.value === '.') return null
    return parseFloat(latest.value).toFixed(2)
  } catch {
    return null
  }
}

/**
 * Pick relevant commodities based on which sectors appear in the drawn cards.
 */
function selectCommodities(drawnCards) {
  const sectors = new Set(drawnCards.map(c => c.sector).filter(Boolean))
  const selected = [GOLD_QUERY]
  for (const sector of sectors) {
    const list = SECTOR_COMMODITIES[sector]
    if (list) selected.push(...list)
  }
  // Deduplicate by fn
  return [...new Map(selected.map(c => [c.fn, c])).values()].slice(0, 6)
}

/**
 * Build a concise description string from the prices object.
 */
function buildDescription(prices) {
  const parts = Object.entries(prices).map(([k, v]) => `${k} $${v}`)
  return `Live commodity prices: ${parts.join(', ')}.`
}

/**
 * Fetch a market snapshot relevant to the drawn cards.
 * Uses cached data if available and fresh (< 4h).
 *
 * @param {Array} drawnCards — the 3 drawn card objects
 * @returns {Promise<{ description: string, prices: Record<string, string> }>}
 */
export async function fetchSnapshot(drawnCards) {
  // Check cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { ts, snapshot } = JSON.parse(cached)
      if (Date.now() - ts < CACHE_TTL_MS) return snapshot
    }
  } catch { /* sessionStorage unavailable */ }

  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY
  if (!apiKey) return DEFAULT_SNAPSHOT

  const commodities = selectCommodities(drawnCards)

  // Fetch sequentially with 250ms gap to stay under 5 req/min
  const prices = {}
  for (const { fn, label } of commodities) {
    const val = await fetchCommodityPrice(fn, apiKey)
    if (val) prices[label] = val
    await new Promise(r => setTimeout(r, 250))
  }

  if (Object.keys(prices).length === 0) return DEFAULT_SNAPSHOT

  const snapshot = { description: buildDescription(prices), prices }

  // Cache result
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), snapshot }))
  } catch { /* ignore */ }

  return snapshot
}
