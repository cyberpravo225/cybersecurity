import { useMemo, useState } from 'react'
import { achievements, scenes, threatLabels } from '../data/gameData'
import { randomizeContext, hydrateText } from '../utils/gameHelpers'

const initialStats = { security: 4, xp: 0, focus: 3, risk: 0, safe: 0, danger: 0 }
const mistakesZero = () => Object.fromEntries(Object.keys(threatLabels).map((k) => [k, 0]))

const parseScene = (raw, ctx) => {
  const [id, chapter, ui, threat, title, text, hint, choices] = raw
  return {
    id,
    chapter,
    ui,
    threat,
    title: hydrateText(title, ctx),
    text: hydrateText(text, ctx),
    hint,
    choices,
  }
}

export function useGameState() {
  const [screen, setScreen] = useState('intro')
  const [difficulty, setDifficulty] = useState('normal')
  const [helpMode, setHelpMode] = useState(true)
  const [ctx, setCtx] = useState(randomizeContext)
  const [index, setIndex] = useState(0)
  const [stats, setStats] = useState(initialStats)
  const [mistakes, setMistakes] = useState(mistakesZero)
  const [unlocked, setUnlocked] = useState([])
  const [last, setLast] = useState(null)

  const sceneList = useMemo(() => scenes.map((s) => parseScene(s, ctx)), [ctx])
  const current = sceneList[index]

  const applyDifficulty = (delta) => {
    const tuned = { ...delta }
    if (difficulty === 'easy') tuned.security = Math.round((tuned.security || 0) * 0.75)
    if (difficulty === 'hard') tuned.security = Math.round((tuned.security || 0) * 1.2)
    return tuned
  }

  const pick = (choice) => {
    const [label, risk, delta, explain] = choice
    const tuned = applyDifficulty(delta)
    setStats((prev) => ({
      security: Math.max(0, Math.min(5, prev.security + (tuned.security || 0))),
      xp: Math.max(0, prev.xp + (tuned.xp || 0)),
      focus: Math.max(0, Math.min(5, prev.focus + (tuned.focus || 0))),
      risk: Math.max(0, prev.risk + (tuned.risk || 0)),
      safe: prev.safe + (risk === 'low' ? 1 : 0),
      danger: prev.danger + (risk === 'high' || risk === 'critical' ? 1 : 0),
    }))

    if (delta.wrong) setMistakes((m) => ({ ...m, [delta.wrong]: m[delta.wrong] + 1 }))
    if (delta.ach && !unlocked.includes(delta.ach)) setUnlocked((a) => [...a, delta.ach])

    const repeat = delta.wrong && mistakes[delta.wrong] > 0
    setLast({ label, risk, explain, repeat, threat: threatLabels[current.threat] })
    setScreen('result')
  }

  const next = () => {
    if (index + 1 >= sceneList.length || stats.security <= 0) {
      setScreen('final')
      return
    }
    setIndex((i) => i + 1)
    setScreen('game')
  }

  const restart = () => {
    setCtx(randomizeContext())
    setIndex(0)
    setStats(initialStats)
    setMistakes(mistakesZero())
    setUnlocked([])
    setLast(null)
    setScreen('start')
  }

  const ending = useMemo(() => {
    const score = stats.security * 24 + stats.xp + stats.safe * 10 - stats.danger * 14 - stats.risk * 4
    if (score < 70) return ['Плохая', 'День был нервным, но ты увидел уязвимости.']
    if (score < 125) return ['Средняя', 'Неплохо, но есть где усилить привычки.']
    if (score < 175) return ['Хорошая', 'Очень достойно: большинство ловушек ты обошёл.']
    return ['Идеальная', 'Отличная кибер-осознанность: спокойно, точно, безопасно.']
  }, [stats])

  const achievementCards = Object.entries(achievements).map(([id, value]) => ({ id, ...value, unlocked: unlocked.includes(id) }))

  return {
    screen, setScreen,
    difficulty, setDifficulty,
    helpMode, setHelpMode,
    sceneList, current,
    index,
    progress: Math.round((index / sceneList.length) * 100),
    stats, mistakes, last,
    achievementCards,
    ending,
    pick, next, restart,
  }
}
