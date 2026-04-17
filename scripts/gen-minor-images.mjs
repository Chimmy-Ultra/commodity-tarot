/**
 * gen-minor-images.mjs
 * Prints a prompt list for Minor Arcana cards that lack images.
 * Run: node scripts/gen-minor-images.mjs
 *
 * Output: one block per card — filename + full image prompt.
 * Copy-paste each prompt into your image generator (Gemini, etc.),
 * save the result as the printed filename in public/cards/,
 * then add the mapping to src/data/cardImages.js.
 */

import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const arcana = require('../src/data/arcana.json')

// Current mapped ids — update this list as you add art
const MAPPED_IDS = new Set([
  // Major Arcana
  0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,
  // Minor Arcana — Phase A
  25, 28, 31, 35, 36, 38, 49, 58, 64, 70, 77,
])

const STYLE_PREAMBLE = {
  Wands:     'Tarot card illustration, warm orange and red fire tones, oil derricks and flames, mystical commodity theme, vertical portrait 2:3, parchment texture, no text —',
  Pentacles: 'Tarot card illustration, gold and bronze metallic tones, glowing coins and precious metals, mystical commodity theme, vertical portrait 2:3, parchment texture, no text —',
  Cups:      'Tarot card illustration, deep teal and forest green tones, coffee plantations and tropical harvests, mystical commodity theme, vertical portrait 2:3, parchment texture, no text —',
  Swords:    'Tarot card illustration, steel blue and silver tones, wheat fields and grain silos, mystical commodity theme, vertical portrait 2:3, parchment texture, no text —',
}

const unmapped = arcana.filter(c => c.suit && !MAPPED_IDS.has(c.id))

console.log(`Cards needing images: ${unmapped.length}\n`)
console.log('='.repeat(60))

for (const card of unmapped) {
  const snake = card.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '')
  const filename = `minor_${card.id}_${snake}.png`
  const preamble = STYLE_PREAMBLE[card.suit] || ''
  console.log(`\n[${card.id}] ${card.name} (${card.suit} / ${card.sector})`)
  console.log(`Filename: public/cards/${filename}`)
  console.log(`Prompt:   ${preamble} ${card.image_prompt}`)
  console.log(`cardImages.js entry:   ${card.id}: '/cards/${filename}',`)
}

console.log('\n' + '='.repeat(60))
console.log(`\nAfter generating each image:`)
console.log(`1. Save to public/cards/<filename>`)
console.log(`2. Add the "cardImages.js entry" line to src/data/cardImages.js`)
