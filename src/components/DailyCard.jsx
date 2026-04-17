import { useMemo } from 'react'
import arcana from '../data/arcana.json'
import { CARD_IMAGES } from '../data/cardImages'
import { todaySeed, seededShuffle } from '../lib/seedrng'

const SUIT_COLORS = {
  Wands:     { border: '#c0530a', accent: '#e8621a', symbol: '⚡' },
  Pentacles: { border: '#b8860b', accent: '#d4af37', symbol: '◎' },
  Cups:      { border: '#1a7a4a', accent: '#2aaa6a', symbol: '♡' },
  Swords:    { border: '#3a5a9a', accent: '#5a8acc', symbol: '✦' },
}

function CardDisplay({ card }) {
  const imgSrc = CARD_IMAGES[card.id]
  const sc = card.suit ? SUIT_COLORS[card.suit] : null
  const borderColor = sc ? sc.border : '#b8860b'

  return (
    <div style={{ width: '200px', height: '333px', position: 'relative', flexShrink: 0 }}>
      <div className="w-full h-full relative rounded-xl overflow-hidden"
        style={{ border: `3px solid ${borderColor}`, background: '#fdf8e8' }}>
        {imgSrc ? (
          <>
            <img src={imgSrc} alt={card.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-center"
              style={{ background: 'rgba(253,248,232,0.92)', borderTop: `1px solid ${borderColor}` }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', fontWeight: 700, color: '#2c1a0e', lineHeight: 1.3 }}>
                {card.suit
                  ? `${card.suit.toUpperCase()} · ${card.name.toUpperCase()}`
                  : `${card.roman} · ${card.name.toUpperCase()}`}
              </div>
              <div style={{ fontFamily: 'Crimson Text, serif', fontSize: '9px', color: '#5a3a1a', fontStyle: 'italic' }}>
                {card.macro_mapping}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4"
            style={{ background: sc ? '#0e1e3a' : '#fdf8e8' }}>
            <div style={{ fontFamily: 'serif', fontSize: '48px', color: sc ? sc.accent : '#b8860b' }}>
              {sc ? sc.symbol : '✦'}
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', fontWeight: 700,
              color: sc ? '#e8dfc0' : '#2c1a0e', textAlign: 'center', marginTop: '12px' }}>
              {card.name.toUpperCase()}
            </div>
            {card.sector && (
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '9px',
                color: sc ? sc.accent : '#b8860b', marginTop: '4px', letterSpacing: '0.1em' }}>
                {card.sector.toUpperCase()}
              </div>
            )}
            <div style={{ fontFamily: 'Crimson Text, serif', fontSize: '9px',
              color: sc ? '#c0b090' : '#5a3a1a', fontStyle: 'italic', textAlign: 'center', marginTop: '8px' }}>
              {card.macro_mapping}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DailyCard() {
  const seed = todaySeed()
  const card = useMemo(() => seededShuffle(arcana, seed)[0], [seed])

  const tweetText = [
    `Commodity Tarot — Daily Card \u{1F0CF}`,
    `${seed}`,
    '',
    `${card.name} — ${card.macro_mapping}`,
    `Keywords: ${card.keywords.join(' · ')}`,
    '',
    '#CommodityTarot #Macro',
  ].join('\n')

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-700 mb-2"
          style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>
          Commodity Tarot
        </h1>
        <p className="text-amber-700 text-sm tracking-widest uppercase mb-1"
          style={{ fontFamily: 'Cinzel, serif' }}>
          Daily Card
        </p>
        <p className="text-stone-500 text-base" style={{ fontFamily: 'Crimson Text, serif' }}>
          {seed}
        </p>
      </div>

      <CardDisplay card={card} />

      <div className="flex flex-wrap gap-1 justify-center max-w-xs">
        {card.keywords.map(kw => (
          <span key={kw}
            className="text-sm px-3 py-1 rounded-full border border-amber-600 text-amber-800 bg-amber-100"
            style={{ fontFamily: 'Crimson Text, serif', fontStyle: 'italic' }}>
            {kw}
          </span>
        ))}
      </div>

      <div className="max-w-sm text-center px-4">
        <p className="text-stone-700 text-lg leading-relaxed"
          style={{ fontFamily: 'Crimson Text, serif', fontStyle: 'italic' }}>
          {card.macro_mapping}
        </p>
        {card.sector && (
          <p className="text-stone-500 text-sm mt-1" style={{ fontFamily: 'Cinzel, serif' }}>
            Sector: {card.sector}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <a href="#/"
          className="px-8 py-3 rounded-full border-2 border-amber-700 text-amber-800 hover:bg-amber-100 hover:text-amber-900 transition-all duration-200 text-lg tracking-wider no-underline"
          style={{ fontFamily: 'Cinzel, serif' }}>
          Draw a Spread
        </a>
        <button
          onClick={() => window.open(tweetUrl, '_blank', 'width=550,height=420')}
          className="px-6 py-3 rounded-full border-2 border-stone-400 text-stone-600 hover:bg-stone-100 hover:text-stone-800 active:scale-95 transition-all duration-200 text-lg tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}>
          Share on 𝕏
        </button>
      </div>
    </div>
  )
}
