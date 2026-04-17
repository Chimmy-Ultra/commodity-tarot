/**
 * generate-images.mjs
 * Generates Minor Arcana card images via Google Gemini API (Imagen 3).
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node scripts/generate-images.mjs
 *   GEMINI_API_KEY=your_key node scripts/generate-images.mjs --suit Wands
 *   GEMINI_API_KEY=your_key node scripts/generate-images.mjs --id 22
 *
 * Options:
 *   --suit <Wands|Pentacles|Cups|Swords>   Only generate for one suit
 *   --id <number>                           Only generate one card by id
 *   --dry-run                               Print prompts without generating
 */

import { writeFileSync, existsSync } from 'fs'
import { createRequire } from 'module'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')

const arcana = require('../src/data/arcana.json')
const { CARD_IMAGES } = await import('../src/data/cardImages.js').catch(() => {
  // Fallback: parse manually if ESM import fails
  const fs = require('fs')
  const src = fs.readFileSync(join(ROOT, 'src/data/cardImages.js'), 'utf8')
  const match = src.match(/export const CARD_IMAGES = \{([\s\S]*?)\}/)
  const ids = [...(match?.[1].matchAll(/^\s+(\d+):/gm) ?? [])].map(m => parseInt(m[1]))
  return { CARD_IMAGES: Object.fromEntries(ids.map(id => [id, true])) }
})

const MAPPED_IDS = new Set(Object.keys(CARD_IMAGES).map(Number))

const STYLE = {
  Wands:     'mystical tarot card illustration, warm orange and amber tones, oil derricks and fire, vertical portrait 2:3 ratio, aged parchment texture border, commodity market theme, no text, no words',
  Pentacles: 'mystical tarot card illustration, gold and bronze tones, precious metals and coins, vertical portrait 2:3 ratio, aged parchment texture border, commodity market theme, no text, no words',
  Cups:      'mystical tarot card illustration, deep teal and forest green tones, coffee and tropical harvest, vertical portrait 2:3 ratio, aged parchment texture border, commodity market theme, no text, no words',
  Swords:    'mystical tarot card illustration, steel blue and silver tones, wheat fields and grain silos, vertical portrait 2:3 ratio, aged parchment texture border, commodity market theme, no text, no words',
}

const API_KEY = process.env.GEMINI_API_KEY
const args = process.argv.slice(2)
const suitFilter = args.includes('--suit') ? args[args.indexOf('--suit') + 1] : null
const idFilter = args.includes('--id') ? parseInt(args[args.indexOf('--id') + 1]) : null
const dryRun = args.includes('--dry-run')

if (!API_KEY && !dryRun) {
  console.error('Error: GEMINI_API_KEY environment variable is required.')
  console.error('Usage: GEMINI_API_KEY=your_key node scripts/generate-images.mjs')
  process.exit(1)
}

const unmapped = arcana.filter(c => {
  if (!c.suit) return false
  if (MAPPED_IDS.has(c.id)) return false
  if (suitFilter && c.suit !== suitFilter) return false
  if (idFilter && c.id !== idFilter) return false
  return true
})

console.log(`Generating ${unmapped.length} card images...\n`)

const DELAY_MS = 4000 // Stay under Gemini rate limits (~15 RPM free tier)

async function generateImage(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`
  const body = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: '3:4',
      safetyFilterLevel: 'BLOCK_ONLY_HIGH',
      personGeneration: 'ALLOW_ADULT',
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Imagen API ${res.status}: ${err}`)
  }

  const data = await res.json()
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('No image in response: ' + JSON.stringify(data))
  return Buffer.from(b64, 'base64')
}

const cardImagesEntries = []

for (let i = 0; i < unmapped.length; i++) {
  const card = unmapped[i]
  const snake = card.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '')
  const filename = `minor_${card.id}_${snake}.png`
  const outPath = join(ROOT, 'public', 'cards', filename)
  const entry = `  ${card.id}: '/cards/${filename}',  // ${card.name}`

  if (dryRun) {
    console.log(`[${i + 1}/${unmapped.length}] ${card.name}`)
    console.log(`  File: ${filename}`)
    console.log(`  Prompt: ${STYLE[card.suit]}, ${card.image_prompt}`)
    console.log()
    continue
  }

  if (existsSync(outPath)) {
    console.log(`[${i + 1}/${unmapped.length}] SKIP (exists): ${filename}`)
    cardImagesEntries.push(entry)
    continue
  }

  process.stdout.write(`[${i + 1}/${unmapped.length}] Generating ${card.name}... `)

  try {
    const fullPrompt = `${STYLE[card.suit]}, ${card.image_prompt}`
    const imgBuffer = await generateImage(fullPrompt)
    writeFileSync(outPath, imgBuffer)
    console.log(`✓ ${filename}`)
    cardImagesEntries.push(entry)
  } catch (err) {
    console.log(`✗ FAILED: ${err.message}`)
  }

  // Rate limit delay (skip after last item)
  if (i < unmapped.length - 1) {
    await new Promise(r => setTimeout(r, DELAY_MS))
  }
}

if (!dryRun && cardImagesEntries.length > 0) {
  console.log('\n─────────────────────────────────────────')
  console.log('Add these lines to src/data/cardImages.js:')
  console.log('─────────────────────────────────────────')
  cardImagesEntries.forEach(e => console.log(e))
  console.log()
  console.log(`Generated ${cardImagesEntries.length} images in public/cards/`)
}
