import { useState, useCallback } from 'react'
import arcana from '../data/arcana.json'

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

function CardFace({ card }) {
  return (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" rx="8" fill="#fdf8e8" />
      <rect x="4" y="4" width="112" height="192" rx="6" fill="none" stroke="#b8860b" strokeWidth="2" />
      <rect x="8" y="8" width="104" height="184" rx="4" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.5" />
      {/* Roman numeral */}
      <text x="60" y="24" textAnchor="middle" fontFamily="serif" fontSize="10" fill="#8b0000" fontWeight="bold">
        {card.roman}
      </text>
      {/* Card name */}
      <text x="60" y="40" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#2c1a0e" fontWeight="bold">
        {card.name.toUpperCase()}
      </text>
      {/* Divider */}
      <line x1="15" y1="44" x2="105" y2="44" stroke="#b8860b" strokeWidth="0.5" />
      {/* Placeholder art area */}
      <rect x="15" y="50" width="90" height="90" rx="4" fill="#e8dfc0" stroke="#b8860b" strokeWidth="0.8" />
      {/* Simple symbolic art based on card id */}
      <text x="60" y="102" textAnchor="middle" fontSize="32" fontFamily="serif" fill="#4a3728" opacity="0.6">
        {getCardSymbol(card.id)}
      </text>
      {/* Divider */}
      <line x1="15" y1="146" x2="105" y2="146" stroke="#b8860b" strokeWidth="0.5" />
      {/* Macro mapping */}
      <foreignObject x="10" y="150" width="100" height="45">
        <div xmlns="http://www.w3.org/1999/xhtml"
          style={{ fontFamily: 'serif', fontSize: '6px', color: '#2c1a0e', textAlign: 'center', lineHeight: '1.4' }}>
          {card.macro_mapping}
        </div>
      </foreignObject>
    </svg>
  )
}

function getCardSymbol(id) {
  const symbols = ['☀', '✦', '☽', '♦', '♛', '☩', '♡', '⚡', '♾', '⚔', '☸', '⚖', '✠', '☠', '⚗', '♟', '⚡', '✦', '☾', '☀', '⚓', '🌍']
  return symbols[id] || '✦'
}

function TarotCard({ card, position, flipped, onFlip }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase"
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
              className="text-xs px-2 py-0.5 rounded-full border border-amber-700 text-amber-300 bg-amber-950/40"
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

  const drawSpread = useCallback(() => {
    const three = shuffle(arcana).slice(0, 3)
    setDrawn(three)
    setFlipped([false, false, false])
    setPhase('spread')
  }, [])

  const flipCard = useCallback((i) => {
    if (!drawn) return
    setFlipped(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }, [drawn])

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <div className="text-center">
        <h1
          className="text-4xl md:text-5xl font-bold text-amber-400 mb-2"
          style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}
        >
          Commodity Tarot
        </h1>
        <p className="text-slate-400 text-lg" style={{ fontFamily: 'Crimson Text, serif' }}>
          Read the macro through the cards
        </p>
      </div>

      {/* Spread area */}
      {phase === 'idle' ? (
        <div className="flex gap-6 opacity-30">
          {POSITIONS.map(pos => (
            <div key={pos} className="flex flex-col items-center gap-3">
              <span className="text-amber-400 text-sm tracking-widest uppercase"
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

      {/* Draw button */}
      <button
        onClick={drawSpread}
        className="px-8 py-3 rounded-full border-2 border-amber-600 text-amber-300 hover:bg-amber-900/30 hover:text-amber-200 active:scale-95 transition-all duration-200 text-lg tracking-wider"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {phase === 'idle' ? 'Draw a Spread' : 'Draw Again'}
      </button>

      {phase === 'spread' && (
        <p className="text-slate-500 text-sm" style={{ fontFamily: 'Crimson Text, serif' }}>
          Click each card to reveal its meaning
        </p>
      )}
    </div>
  )
}
