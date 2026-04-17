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
  defaultViewport: { width: 1440, height: 900 },
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

try {
  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 500))

  // 1) Hero: initial face-down state
  await page.screenshot({ path: path.join(DOCS, 'hero.png'), fullPage: false })
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
  await page.screenshot({ path: path.join(DOCS, 'spread.png'), fullPage: false })
  console.log('spread.png ✓')

  // 3) Reading: click "Get Reading" and scroll
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Get Reading'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1500))
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await new Promise(r => setTimeout(r, 300))
  await page.screenshot({ path: path.join(DOCS, 'reading.png'), fullPage: false })
  console.log('reading.png ✓')
} finally {
  await browser.close()
}
