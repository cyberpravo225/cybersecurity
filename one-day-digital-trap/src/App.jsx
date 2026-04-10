import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BackgroundFX from './components/BackgroundFX'
import HUD from './components/HUD'
import StartScreen from './components/StartScreen'
import RulesScreen from './components/RulesScreen'
import SceneScreen from './components/SceneScreen'
import ResultScreen from './components/ResultScreen'
import FinalScreen from './components/FinalScreen'
import SoundControls from './components/SoundControls'
import { useGameState } from './hooks/useGameState'
import { audio } from './utils/audioManager'

function Intro({ onNext }) {
  useEffect(() => {
    audio.play('yawn')
    const t = setTimeout(onNext, 1800)
    return () => clearTimeout(t)
  }, [onNext])

  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: [1, .25, 1, .65, 0] }} transition={{ duration: 1.7 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <p className="tracking-[.22em] text-slate-400">06:42 — новый день начинается</p>
    </motion.div>
  )
}

export default function App() {
  const game = useGameState()
  const [muted, setMuted] = useState(audio.muted)
  const [volume, setVolume] = useState(audio.volume)

  useEffect(() => {
    if (game.screen === 'game' && game.current) {
      const map = { sms: 'sms', email: 'email', call: 'call' }
      audio.play(map[game.current.ui] || 'whoosh')
    }
  }, [game.screen, game.index, game.current])

  return (
    <>
      <BackgroundFX />
      {game.screen === 'intro' && <Intro onNext={() => game.setScreen('start')} />}
      <SoundControls
        muted={muted}
        volume={volume}
        onMute={() => { audio.setMuted(!muted); setMuted(!muted) }}
        onVolume={(v) => { audio.setVolume(v); setVolume(v) }}
      />

      <main className="relative z-10 mx-auto min-h-screen max-w-6xl space-y-4 px-4 pb-10 pt-20">
        {game.screen === 'game' && game.current && <HUD stats={game.stats} progress={game.progress} chapter={game.current.chapter} />}

        <AnimatePresence mode="wait">
          {game.screen === 'start' && <motion.div key="start" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><StartScreen onStart={() => { audio.play('click'); game.setScreen('game') }} onRules={() => game.setScreen('rules')} /></motion.div>}
          {game.screen === 'rules' && <motion.div key="rules" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><RulesScreen difficulty={game.difficulty} setDifficulty={game.setDifficulty} helpMode={game.helpMode} setHelpMode={game.setHelpMode} onStart={() => game.setScreen('game')} onBack={() => game.setScreen('start')} /></motion.div>}
          {game.screen === 'game' && game.current && <motion.div key={game.current.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><SceneScreen scene={game.current} helpMode={game.helpMode} onPick={(c)=>{const risk=c[1]; audio.play(risk==='low'?'success':'error'); game.pick(c)}} /></motion.div>}
          {game.screen === 'result' && game.last && <motion.div key="result" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><ResultScreen last={game.last} onNext={game.next} /></motion.div>}
          {game.screen === 'final' && <motion.div key="final" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}><FinalScreen ending={game.ending} stats={game.stats} mistakes={game.mistakes} achievementCards={game.achievementCards} onRestart={game.restart} /></motion.div>}
        </AnimatePresence>
      </main>
    </>
  )
}
