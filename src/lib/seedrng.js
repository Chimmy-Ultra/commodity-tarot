/**
 * seedrng.js — Deterministic daily card selection via seeded RNG.
 * Uses mulberry32 PRNG seeded from today's date string.
 */

function mulberry32(seed) {
  let t = seed + 0x6d2b79f5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return h >>> 0
}

/**
 * Returns today's date as "YYYY-MM-DD" — used as the daily seed.
 */
export function todaySeed() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Deterministic Fisher-Yates shuffle seeded by a string.
 * Same seed always produces the same order.
 */
export function seededShuffle(arr, seed) {
  let s = hashString(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    s = hashString(String(s))
    const j = Math.floor(mulberry32(s) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
