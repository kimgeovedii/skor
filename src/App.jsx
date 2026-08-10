import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Minus, RotateCcw, Maximize, Minimize, Trash2, UserPlus } from 'lucide-react'

const STORAGE_KEY = 'skor-turnamen-badminton'
const SOUND_INCREMENT = '/audio/ssstik.io_1786355463088.mp3'
const SOUND_DECREMENT = '/audio/fahhhhhhhhhhhhhh.mp3'

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  }, [key, value])

  return [value, setValue]
}

/* ──── Score pop animation ──── */
function ScorePop({ active }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div className="w-full h-full rounded-2xl border-2 border-amber-400/60 animate-[ping_0.6s_ease-out_1]" />
    </div>
  )
}

/* ══════════════════════════════════════════════
   FOOTBALL-STYLE SCOREBOARD (2 players)
   ══════════════════════════════════════════════ */
function FootballScoreboard({ players, highestScore, hasWinner, animatingId, onIncrement, onDecrement }) {
  const teamA = players[0]
  const teamB = players[1]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ── Main Scoreboard Panel ── */}
      <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />

        {/* Scoreboard Content */}
        <div className="relative px-4 md:px-8 py-6 md:py-8">
          {/* Match info top bar */}
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[0.6rem] md:text-xs font-bold tracking-[0.3em] text-amber-400/80 uppercase">Badminton Match</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Main Score Display */}
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Team A */}
            <div className="flex-1 text-center">
              <h2 className="text-white/90 text-sm md:text-xl font-extrabold tracking-wider uppercase truncate">
                {teamA.name}
              </h2>
            </div>

            {/* Scores */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {/* Team A Score */}
              <div className="relative">
                <ScorePop active={animatingId === teamA.id} />
                <div className={`
                  w-20 h-24 md:w-32 md:h-40 lg:w-36 lg:h-44
                  flex items-center justify-center
                  bg-gradient-to-b from-white/15 to-white/5 
                  rounded-2xl border border-white/10
                  ${hasWinner && teamA.score === highestScore && teamA.score > 0 ? 'ring-2 ring-amber-400/50' : ''}
                  transition-all duration-300
                `}>
                  <span className={`
                    text-5xl md:text-8xl lg:text-9xl font-black tabular-nums text-white
                    transition-transform duration-200
                    ${animatingId === teamA.id ? 'scale-110' : 'scale-100'}
                  `} style={{ textShadow: '0 0 30px rgba(255,255,255,0.15)' }}>
                    {teamA.score}
                  </span>
                </div>
              </div>

              {/* VS Separator */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-6 md:h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-amber-400/70 text-xs md:text-sm font-black tracking-widest">VS</span>
                <div className="w-px h-6 md:h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>

              {/* Team B Score */}
              <div className="relative">
                <ScorePop active={animatingId === teamB.id} />
                <div className={`
                  w-20 h-24 md:w-32 md:h-40 lg:w-36 lg:h-44
                  flex items-center justify-center
                  bg-gradient-to-b from-white/15 to-white/5 
                  rounded-2xl border border-white/10
                  ${hasWinner && teamB.score === highestScore && teamB.score > 0 ? 'ring-2 ring-amber-400/50' : ''}
                  transition-all duration-300
                `}>
                  <span className={`
                    text-5xl md:text-8xl lg:text-9xl font-black tabular-nums text-white
                    transition-transform duration-200
                    ${animatingId === teamB.id ? 'scale-110' : 'scale-100'}
                  `} style={{ textShadow: '0 0 30px rgba(255,255,255,0.15)' }}>
                    {teamB.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="flex-1 text-center">
              <h2 className="text-white/90 text-sm md:text-xl font-extrabold tracking-wider uppercase truncate">
                {teamB.name}
              </h2>
            </div>
          </div>

          {/* Winner indicator */}
          {hasWinner && (
            <div className="flex items-center justify-center mt-4 md:mt-6">
              <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5">
                <span className="text-lg">🏸</span>
                <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">
                  {players.find(p => p.score === highestScore)?.name} Unggul
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>

      {/* ── Control Buttons (OUTSIDE scoreboard) ── */}
      <div className="flex items-stretch justify-between gap-4 mt-5 px-2 md:px-8">
        {/* Team A Controls */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <button
            onClick={() => onDecrement(teamA.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-decrement-a"
          >
            <Minus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">{teamA.name}</span>
          <button
            onClick={() => onIncrement(teamA.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-increment-a"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Team B Controls */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <button
            onClick={() => onDecrement(teamB.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-decrement-b"
          >
            <Minus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">{teamB.name}</span>
          <button
            onClick={() => onIncrement(teamB.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-increment-b"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MULTI-TEAM GRID (3-4 players)
   ══════════════════════════════════════════════ */
function MultiTeamGrid({ players, highestScore, hasWinner, animatingId, onIncrement, onDecrement, onRemove }) {
  const cardColors = ['from-red-700 to-red-800', 'from-slate-700 to-slate-800', 'from-amber-600 to-amber-700', 'from-blue-700 to-blue-800']

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 w-full max-w-4xl mx-auto">
      {players.map((player, idx) => (
        <div key={player.id} className="relative group">
          {/* Remove button */}
          {players.length > 2 && (
            <button
              onClick={() => onRemove(player.id)}
              className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
              title="Hapus tim"
            >
              ✕
            </button>
          )}

          {/* Card */}
          <div className={`relative bg-gradient-to-br ${cardColors[idx % cardColors.length]} rounded-2xl overflow-hidden shadow-xl border border-white/10`}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/50 via-white/20 to-amber-400/50" />
            <div className="p-4 md:p-6 text-center">
              {hasWinner && player.score === highestScore && player.score > 0 && (
                <div className="mb-1 animate-bounce">
                  <span className="text-2xl">🏸</span>
                </div>
              )}
              <h3 className="text-white/80 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2">{player.name}</h3>
              <div className="relative">
                <ScorePop active={animatingId === player.id} />
                <span className={`text-5xl md:text-7xl font-black tabular-nums text-white transition-transform duration-200 ${animatingId === player.id ? 'scale-110' : 'scale-100'}`}
                  style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
                  {player.score}
                </span>
              </div>
            </div>
          </div>

          {/* Controls outside */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              onClick={() => onDecrement(player.id)}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => onIncrement(player.id)}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════ */
function App() {
  const [players, setPlayers] = useLocalStorage(STORAGE_KEY, [
    { id: 1, name: 'Tim A', score: 0, color: 'red' },
    { id: 2, name: 'Tim B', score: 0, color: 'white' },
  ])

  const [newPlayerName, setNewPlayerName] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [animatingId, setAnimatingId] = useState(null)
  const audioIncRef = useRef(null)
  const audioDecRef = useRef(null)

  const colorCycle = ['red', 'white', 'gold', 'blue']

  useEffect(() => {
    audioIncRef.current = new Audio(SOUND_INCREMENT)
    audioIncRef.current.volume = 0.5
    audioDecRef.current = new Audio(SOUND_DECREMENT)
    audioDecRef.current.volume = 0.5
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const playSound = useCallback((type) => {
    try {
      const audio = type === 'increment' ? audioIncRef.current : audioDecRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
    } catch { /* ignore */ }
  }, [])

  const triggerAnimation = useCallback((id) => {
    setAnimatingId(id)
    setTimeout(() => setAnimatingId(null), 600)
  }, [])

  const handleIncrement = useCallback((id) => {
    setPlayers(prev =>
      prev.map(p => p.id === id ? { ...p, score: p.score + 1 } : p)
    )
    playSound('increment')
    triggerAnimation(id)
  }, [playSound, triggerAnimation, setPlayers])

  const handleDecrement = useCallback((id) => {
    const player = players.find(p => p.id === id)
    if (player && player.score <= 0) return
    setPlayers(prev =>
      prev.map(p => p.id === id ? { ...p, score: Math.max(0, p.score - 1) } : p)
    )
    playSound('decrement')
    triggerAnimation(id)
  }, [playSound, triggerAnimation, setPlayers, players])

  const resetAll = useCallback(() => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
  }, [setPlayers])

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setPlayers([
      { id: 1, name: 'Tim A', score: 0, color: 'red' },
      { id: 2, name: 'Tim B', score: 0, color: 'white' },
    ])
  }, [setPlayers])

  const addPlayer = useCallback(() => {
    if (!newPlayerName.trim() || players.length >= 4) return
    setPlayers(prev => [
      ...prev,
      { id: Date.now(), name: newPlayerName.trim(), score: 0, color: colorCycle[prev.length % colorCycle.length] },
    ])
    setNewPlayerName('')
  }, [newPlayerName, players.length, setPlayers])

  const removePlayer = useCallback((id) => {
    if (players.length <= 2) return
    setPlayers(prev => prev.filter(p => p.id !== id))
  }, [players.length, setPlayers])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const highestScore = Math.max(...players.map(p => p.score))
  const hasWinner = highestScore > 0
  const isTwoPlayers = players.length === 2

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 text-gray-900 overflow-hidden relative">
      {/* ── Decorative red stripes ── */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />

      {/* Subtle bg shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      {/* Flag accents */}
      <div className="fixed top-2 left-4 text-2xl opacity-15 pointer-events-none z-30">🇮🇩</div>
      <div className="fixed top-2 right-14 text-2xl opacity-15 pointer-events-none z-30">🇮🇩</div>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-3 right-4 z-50 p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer"
        id="btn-fullscreen"
        title={isFullscreen ? 'Keluar fullscreen' : 'Mode fullscreen'}
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-5 md:py-8">
        {/* ── Header ── */}
        <header className="text-center mb-6 md:mb-8">
          <div className="inline-flex flex-col items-center gap-1 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl">🇮🇩</span>
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[0.6rem] md:text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-lg shadow-red-300/30">
                DIRGAHAYU REPUBLIK INDONESIA KE-81
              </div>
              <span className="text-2xl md:text-3xl">🇮🇩</span>
            </div>
            <p className="text-red-400 text-[0.6rem] font-semibold tracking-[0.3em] uppercase">17 Agustus 2026</p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-1">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md" />
          </div>

          <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-red-700 via-red-600 to-red-700 bg-clip-text text-transparent tracking-tight">
            Turnamen Badminton
          </h1>
          <p className="text-red-500/60 text-xs md:text-sm font-bold tracking-widest uppercase">
            PT LPP Agro Nusantara
          </p>

          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-300" />
            <span className="text-amber-500 text-sm">★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-300" />
          </div>
        </header>

        {/* ── Scoreboard ── */}
        {isTwoPlayers ? (
          <FootballScoreboard
            players={players}
            highestScore={highestScore}
            hasWinner={hasWinner}
            animatingId={animatingId}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        ) : (
          <MultiTeamGrid
            players={players}
            highestScore={highestScore}
            hasWinner={hasWinner}
            animatingId={animatingId}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={removePlayer}
          />
        )}

        {/* ── Bottom Controls ── */}
        <div className="space-y-3 mt-8 max-w-2xl mx-auto">
          {players.length < 4 && (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-red-100 rounded-2xl p-3 shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPlayer()}
                  placeholder="Nama tim baru..."
                  className="flex-1 bg-red-50/50 border-2 border-red-100 rounded-xl px-4 py-2 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
                  id="input-player-name"
                />
                <Button
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim()}
                  className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-5 cursor-pointer disabled:opacity-30 shadow-md shadow-red-200"
                  id="btn-add-player"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Tambah Tim
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={resetAll}
              variant="outline"
              className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 rounded-xl px-5 cursor-pointer shadow-sm text-sm"
              id="btn-reset-all"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset Skor
            </Button>
            <Button
              onClick={clearStorage}
              variant="outline"
              className="bg-white hover:bg-red-50 text-red-500 border-red-200 hover:border-red-400 rounded-xl px-5 cursor-pointer shadow-sm text-sm"
              id="btn-clear-storage"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Hapus Data
            </Button>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center mt-8 text-red-300 text-[0.65rem] space-y-0.5">
          <p>Data tersimpan otomatis di browser • Maksimal 4 tim</p>
          <p className="text-red-300/70 font-semibold tracking-wider">MERDEKA! 🇮🇩</p>
        </footer>
      </div>
    </div>
  )
}

export default App
