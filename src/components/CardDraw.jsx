import { useState, useCallback } from 'react'
import arcana from '../data/arcana.json'
import { CARD_IMAGES } from '../data/cardImages'
import { getReading } from '../lib/reading'
import { fetchSnapshot } from '../lib/market'

const POSITIONS = ['Past', 'Present', 'Future']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function CardBack() {
  return (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" rx="8" fill="#1a0a2e" />
      <rect x="6" y="6" width="108" height="188" rx="6" fill="none" stroke="#b8860b" strokeWidth="1.5" />
      <rect x="12" y="12" width="96" height="176" rx="4" fill="none" stroke="#b8860b" strokeWidth="0.5" opacity="0.6" />
      {/* Central diamond pattern */}
      <polygon points="60,30 90,100 60,170 30,100" fill="none" stroke="#b8860b" strokeWidth="1" opacity="0.8" />
      <polygon points="60,50 80,100 60,150 40,100" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.6" />
      {/* Corner ornaments */}
      <circle cx="20" cy="20" r="4" fill="none" stroke="#b8860b" strokeWidth="1" />
      <circle cx="100" cy="20" r="4" fill="none" stroke="#b8860b" strokeWidth="1" />
      <circle cx="20" cy="180" r="4" fill="none" stroke="#b8860b" strokeWidth="1" />
      <circle cx="100" cy="180" r="4" fill="none" stroke="#b8860b" strokeWidth="1" />
      {/* Star of eight */}
      {[0,45,90,135].map(angle => (
        <line
          key={angle}
          x1={60 + 10 * Math.cos((angle * Math.PI) / 180)}
          y1={100 + 10 * Math.sin((angle * Math.PI) / 180)}
          x2={60 - 10 * Math.cos((angle * Math.PI) / 180)}
          y2={100 - 10 * Math.sin((angle * Math.PI) / 180)}
          stroke="#d4af37"
          strokeWidth="1"
          opacity="0.9"
        />
      ))}
      <circle cx="60" cy="100" r="6" fill="none" stroke="#d4af37" strokeWidth="1" />
      <circle cx="60" cy="100" r="2" fill="#d4af37" opacity="0.7" />
    </svg>
  )
}


const SUIT_COLORS = {
  Wands:     { border: '#c0530a', fill: '#3d1a08', accent: '#e8621a', symbol: '⚡' },
  Pentacles: { border: '#b8860b', fill: '#2c1a06', accent: '#d4af37', symbol: '◎' },
  Cups:      { border: '#1a7a4a', fill: '#0a2a1a', accent: '#2aaa6a', symbol: '♡' },
  Swords:    { border: '#3a5a9a', fill: '#0e1e3a', accent: '#5a8acc', symbol: '✦' },
}

function CardFace({ card }) {
  const imgSrc = CARD_IMAGES[card.id]
  const suitStyle = card.suit ? SUIT_COLORS[card.suit] : null

  if (imgSrc) {
    return (
      <div className="w-full h-full relative rounded-lg overflow-hidden"
        style={{ border: `2px solid ${suitStyle ? suitStyle.border : '#b8860b'}`, background: '#fdf8e8' }}>
        <img src={imgSrc} alt={card.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 px-1 py-1 text-center"
          style={{ background: 'rgba(253,248,232,0.88)', borderTop: `1px solid ${suitStyle ? suitStyle.border : '#b8860b'}` }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '7px', fontWeight: 700, color: '#2c1a0e', lineHeight: 1.2 }}>
            {card.suit
              ? `${card.suit.toUpperCase()} · ${card.name.toUpperCase()}`
              : `${card.roman} · ${card.name.toUpperCase()}`}
          </div>
          <div style={{ fontFamily: 'Crimson Text, serif', fontSize: '6px', color: '#5a3a1a', fontStyle: 'italic', lineHeight: 1.2 }}>
            {card.macro_mapping}
          </div>
        </div>
      </div>
    )
  }

  // Suit-aware SVG fallback
  const sc = suitStyle || { border: '#b8860b', fill: '#e8dfc0', accent: '#d4af37', symbol: '✦' }
  const topLabel = card.suit ? card.rank : card.roman
  const bgFill = card.suit ? sc.fill : '#fdf8e8'
  const textFill = card.suit ? '#e8dfc0' : '#2c1a0e'
  const subTextFill = card.suit ? sc.accent : '#8b0000'

  return (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" rx="8" fill={bgFill} />
      <rect x="4" y="4" width="112" height="192" rx="6" fill="none" stroke={sc.border} strokeWidth="2" />
      <rect x="8" y="8" width="104" height="184" rx="4" fill="none" stroke={sc.accent} strokeWidth="0.8" opacity="0.5" />
      <text x="60" y="22" textAnchor="middle" fontFamily="serif" fontSize="9" fill={subTextFill} fontWeight="bold">
        {topLabel}
      </text>
      <text x="60" y="38" textAnchor="middle" fontFamily="serif" fontSize="7" fill={textFill} fontWeight="bold">
        {card.name.toUpperCase()}
      </text>
      <line x1="15" y1="43" x2="105" y2="43" stroke={sc.border} strokeWidth="0.5" />
      <rect x="15" y="49" width="90" height="90" rx="4" fill={card.suit ? 'rgba(255,255,255,0.05)' : '#e8dfc0'} stroke={sc.border} strokeWidth="0.8" />
      <text x="60" y="101" textAnchor="middle" fontSize="34" fontFamily="serif" fill={sc.accent} opacity="0.8">
        {sc.symbol}
      </text>
      {card.sector && (
        <text x="60" y="130" textAnchor="middle" fontFamily="serif" fontSize="7" fill={sc.accent} opacity="0.7">
          {card.sector.toUpperCase()}
        </text>
      )}
      <line x1="15" y1="145" x2="105" y2="145" stroke={sc.border} strokeWidth="0.5" />
      <foreignObject x="10" y="149" width="100" height="46">
        <div xmlns="http://www.w3.org/1999/xhtml"
          style={{ fontFamily: 'serif', fontSize: '6px', color: textFill, textAlign: 'center', lineHeight: '1.4' }}>
          {card.macro_mapping}
        </div>
      </foreignObject>
    </svg>
  )
}

function TarotCard({ card, position, flipped, onFlip }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-amber-700 text-sm font-semibold tracking-widest uppercase"
        style={{ fontFamily: 'Cinzel, serif' }}>
        {position}
      </span>
      {/* Card container with perspective */}
      <div
        className="cursor-pointer select-none"
        style={{ width: '120px', height: '200px', perspective: '1000px' }}
        onClick={onFlip}
        title={flipped ? card.name : 'Click to reveal'}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Back face */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
            <CardBack />
          </div>
          {/* Front face */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}>
            {card ? <CardFace card={card} /> : null}
          </div>
        </div>
      </div>
      {/* Keywords below card */}
      {flipped && card && (
        <div className="flex flex-wrap justify-center gap-1 max-w-[140px]">
          {card.keywords.map(kw => (
            <span key={kw}
              className="text-xs px-2 py-0.5 rounded-full border border-amber-600 text-amber-800 bg-amber-100"
              style={{ fontFamily: 'Crimson Text, serif', fontStyle: 'italic' }}>
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CardDraw() {
  const [drawn, setDrawn] = useState(null)      // array of 3 cards
  const [flipped, setFlipped] = useState([false, false, false])
  const [phase, setPhase] = useState('idle')    // idle | spread | reading
  const [narrative, setNarrative] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const allFlipped = phase === 'spread' && flipped.every(Boolean)

  const drawSpread = useCallback(() => {
    const three = shuffle(arcana).slice(0, 3)
    setDrawn(three)
    setFlipped([false, false, false])
    setPhase('spread')
    setNarrative(null)
    setLoading(false)
    setError(null)
  }, [])

  const flipCard = useCallback((i) => {
    if (!drawn) return
    setFlipped(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }, [drawn])

  const requestReading = useCallback(async () => {
    if (!drawn) return
    setLoading(true)
    setError(null)
    try {
      const snapshot = await fetchSnapshot(drawn)
      const { narrative: text } = await getReading(drawn, snapshot)
      setNarrative(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [drawn])

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <div className="text-center">
        <h1
          className="text-4xl md:text-5xl font-bold text-amber-700 mb-2"
          style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}
        >
          Commodity Tarot
        </h1>
        <p className="text-stone-500 text-lg" style={{ fontFamily: 'Crimson Text, serif' }}>
          Read the macro through the cards
        </p>
        <a href="#/daily"
          className="inline-block mt-2 text-xs tracking-widest uppercase text-amber-600 hover:text-amber-800 transition-colors duration-150"
          style={{ fontFamily: 'Cinzel, serif' }}>
          ✦ Daily Card ✦
        </a>
      </div>

      {/* Spread area */}
      {phase === 'idle' ? (
        <div className="flex gap-6 opacity-50">
          {POSITIONS.map(pos => (
            <div key={pos} className="flex flex-col items-center gap-3">
              <span className="text-amber-700 text-sm tracking-widest uppercase"
                style={{ fontFamily: 'Cinzel, serif' }}>{pos}</span>
              <div style={{ width: '120px', height: '200px' }}><CardBack /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-start justify-center">
          {drawn.map((card, i) => (
            <TarotCard
              key={card.id}
              card={card}
              position={POSITIONS[i]}
              flipped={flipped[i]}
              onFlip={() => flipCard(i)}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={drawSpread}
          className="px-8 py-3 rounded-full border-2 border-amber-700 text-amber-800 hover:bg-amber-100 hover:text-amber-900 active:scale-95 transition-all duration-200 text-lg tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          {phase === 'idle' ? 'Draw a Spread' : 'Draw Again'}
        </button>

        {allFlipped && !narrative && !loading && (
          <button
            onClick={requestReading}
            className="px-8 py-3 rounded-full border-2 border-amber-600 text-amber-700 hover:bg-amber-100 hover:text-amber-900 active:scale-95 transition-all duration-200 text-lg tracking-wider"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Get Reading
          </button>
        )}

        {allFlipped && (
          <button
            onClick={() => {
              const text = [
                'Commodity Tarot \u{1F0CF}',
                '',
                ...drawn.map((c, i) => `${POSITIONS[i]}: ${c.name} \u2014 ${c.macro_mapping}`),
                '',
                '#CommodityTarot #Macro',
              ].join('\n')
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                '_blank',
                'width=550,height=420'
              )
            }}
            className="px-6 py-3 rounded-full border-2 border-stone-400 text-stone-600 hover:bg-stone-100 hover:text-stone-800 active:scale-95 transition-all duration-200 text-lg tracking-wider"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Share on 𝕏
          </button>
        )}
      </div>

      {phase === 'spread' && !allFlipped && (
        <p className="text-stone-500 text-sm" style={{ fontFamily: 'Crimson Text, serif' }}>
          Click each card to reveal its meaning
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-amber-700 text-lg animate-pulse" style={{ fontFamily: 'Crimson Text, serif' }}>
          Consulting the markets...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="max-w-xl text-center text-red-600 text-sm" style={{ fontFamily: 'Crimson Text, serif' }}>
          {error}
        </div>
      )}

      {/* Narrative reading */}
      {narrative && (
        <div className="max-w-2xl mx-4 p-6 rounded-xl border border-amber-400 bg-amber-50"
          style={{ fontFamily: 'Crimson Text, serif' }}>
          <h2 className="text-amber-700 text-lg font-semibold mb-4 text-center tracking-wider"
            style={{ fontFamily: 'Cinzel, serif' }}>
            The Reading
          </h2>
          <div className="text-stone-700 text-base leading-relaxed whitespace-pre-line">
            {narrative}
          </div>
        </div>
      )}
    </div>
  )
}
