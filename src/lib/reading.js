/**
 * reading.js — Anthropic API narrative generation
 *
 * Generates a narrative reading from 3 tarot cards + a market snapshot.
 * Falls back to a stub narrative when VITE_ANTHROPIC_KEY is not set.
 */

const MODEL = 'claude-sonnet-4-6'

export const DEFAULT_SNAPSHOT = {
  description: 'Mixed macro signals. Fed on hold with rates elevated, tariff uncertainty weighing on global trade. Oil ~$65, gold near all-time highs ~$3,300, copper soft on demand concerns.',
  description_zh: '總體經濟信號分歧。Fed 按兵不動、利率維持高位，關稅不確定性壓抑全球貿易。油價約 65 美元，黃金接近歷史高點約 3,300 美元，銅因需求疑慮走軟。',
}

/**
 * @param {Array<{name: string, macro_mapping: string, keywords: string[]}>} cards
 *   Array of exactly 3 card objects (past, present, future).
 * @param {{ description: string, prices?: Record<string, string> }} [marketSnapshot]
 *   Brief snapshot of current market conditions.
 * @returns {Promise<{ narrative: string }>}
 */
export async function getReading(cards, marketSnapshot = DEFAULT_SNAPSHOT) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY

  if (!apiKey) {
    return { narrative: buildStubNarrative(cards, marketSnapshot) }
  }

  const prompt = buildPrompt(cards, marketSnapshot)

  const res = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return { narrative: data.content[0].text }
}

function buildPrompt(cards, snapshot) {
  const [past, present, future] = cards
  return `You are a macro strategist who interprets tarot cards as market regime signals.

Market context: ${snapshot.description}
${snapshot.prices ? Object.entries(snapshot.prices).map(([k, v]) => `  ${k}: ${v}`).join('\n') : ''}

Three-card spread:
- Past: ${past.name} — "${past.macro_mapping}" | keywords: ${past.keywords.join(', ')}
- Present: ${present.name} — "${present.macro_mapping}" | keywords: ${present.keywords.join(', ')}
- Future: ${future.name} — "${future.macro_mapping}" | keywords: ${future.keywords.join(', ')}

Write a 3-paragraph narrative reading (past dynamic → current regime → emerging signal) in the voice of a seasoned commodity trader. Be specific about which markets and macro forces are implied. 2–3 sentences per paragraph.`
}

function buildStubNarrative(cards, snapshot) {
  const [past, present, future] = cards
  return `Past — ${past.name} ／ ${past.name_zh}
(${past.macro_mapping} ／ ${past.macro_mapping_zh})
The ${past.keywords[0]} dynamic shaped the prior regime, establishing the structural context for what followed.
${past.keywords[0]} 的動態主導了前一個市場週期，奠定後續發展的結構性背景。

Present — ${present.name} ／ ${present.name_zh}
(${present.macro_mapping} ／ ${present.macro_mapping_zh})
Markets are now navigating ${present.keywords[1]}, with ${present.keywords[0]} as the dominant force across commodity complexes.
市場正在經歷 ${present.keywords[1]}，${present.keywords[0]} 是橫跨各大宗商品市場的主導力量。

Future — ${future.name} ／ ${future.name_zh}
(${future.macro_mapping} ／ ${future.macro_mapping_zh})
The emerging signal points toward ${future.keywords[0]}. Watch for ${future.keywords[2]} as the next catalyst.
新興信號指向 ${future.keywords[0]}。留意 ${future.keywords[2]} 成為下一個催化劑。

Context ／ 背景脈絡
${snapshot.description}
${snapshot.description_zh || ''}`
}
