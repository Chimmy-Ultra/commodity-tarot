/**
 * reading.js — Anthropic API stub
 *
 * Generates a narrative reading from 3 tarot cards + a market snapshot.
 * Currently returns a placeholder; wire VITE_ANTHROPIC_KEY to activate.
 *
 * TODO: Issue #3 — Anthropic API integration
 */

const MODEL = 'claude-opus-4-6'

/**
 * @param {Array<{name: string, macro_mapping: string, keywords: string[]}>} cards
 *   Array of exactly 3 card objects (past, present, future).
 * @param {{ description: string, prices?: Record<string, string> }} marketSnapshot
 *   Brief snapshot of current market conditions.
 * @returns {Promise<{ narrative: string }>}
 */
export async function getReading(cards, marketSnapshot) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY

  if (!apiKey) {
    return { narrative: buildStubNarrative(cards, marketSnapshot) }
  }

  const prompt = buildPrompt(cards, marketSnapshot)

  // TODO: replace with @anthropic-ai/sdk when key is available
  const res = await fetch('https://api.anthropic.com/v1/messages', {
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
  return `[Stub — add VITE_ANTHROPIC_KEY to .env to activate live readings]

Past — ${past.name} (${past.macro_mapping}): The ${past.keywords[0]} dynamic shaped the prior regime, establishing the structural context for what followed.

Present — ${present.name} (${present.macro_mapping}): Markets are now navigating ${present.keywords[1]}, with ${present.keywords[0]} as the dominant force across commodity complexes.

Future — ${future.name} (${future.macro_mapping}): The emerging signal points toward ${future.keywords[0]}. Watch for ${future.keywords[2]} as the next catalyst.

Context: ${snapshot.description}`
}
