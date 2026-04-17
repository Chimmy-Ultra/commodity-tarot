/**
 * Screenshot helper — runs once to generate docs/screenshots/{hero,spread,reading}.png
 * Requires local dev server running on http://localhost:5173 and puppeteer-core installed.
 */
import puppeteer from 'puppeteer-core'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOCS = path.join(__dirname, '..', 'docs', 'screenshots')
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = 'http://localhost:5173'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 960, height: 900 },
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

/** Crop screenshot tightly around the main content div, with padding */
async function screenshotContent(page, filePath, padding = 24) {
  const rect = await page.evaluate(() => {
    const el = document.querySelector('[class*="flex"][class*="flex-col"][class*="items-center"]')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.left, y: r.top, width: r.width, height: r.height }
  })

  if (!rect || rect.height < 50) {
    // Fallback: fullPage screenshot
    await page.screenshot({ path: filePath, fullPage: true })
    return
  }

  await page.screenshot({
    path: filePath,
    clip: {
      x: Math.max(0, rect.x - padding),
      y: Math.max(0, rect.y - padding),
      width: Math.min(rect.width + padding * 2, 960),
      height: rect.height + padding * 2,
    },
  })
}

try {
  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 500))

  // 1) Hero: initial face-down state
  await screenshotContent(page, path.join(DOCS, 'hero.png'))
  console.log('hero.png ✓')

  // 2) Spread: click "Draw a Spread" and reveal all 3 cards
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Draw a Spread'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 400))

  // Click each .cursor-pointer card to flip
  const cardHandles = await page.$$('.cursor-pointer')
  for (const h of cardHandles) {
    await h.click()
    await new Promise(r => setTimeout(r, 300))
  }
  await new Promise(r => setTimeout(r, 800))
  await screenshotContent(page, path.join(DOCS, 'spread.png'))
  console.log('spread.png ✓')

  // 3) Reading: click "Get Reading" and wait for narrative
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Get Reading'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1800))
  await screenshotContent(page, path.join(DOCS, 'reading.png'))
  console.log('reading.png ✓')
} finally {
  await browser.close()
}
