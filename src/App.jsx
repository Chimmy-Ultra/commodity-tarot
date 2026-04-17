import { useState, useEffect } from 'react'
import CardDraw from './components/CardDraw'
import DailyCard from './components/DailyCard'

function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const handler = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const isDaily = hash === '#/daily'

  return (
    <div className="min-h-screen" style={{ background: '#FAF9F7' }}>
      {isDaily ? <DailyCard /> : <CardDraw />}
    </div>
  )
}
