import { motion } from 'framer-motion'

const Meter = ({ name, value, max, color }) => (
  <div className="glass-card rounded-2xl p-3">
    <div className="mb-2 flex justify-between text-xs text-slate-300"><span>{name}</span><b>{value}/{max}</b></div>
    <div className="h-2 rounded-full bg-white/10"><motion.div className="h-2 rounded-full" style={{ background: color }} animate={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }} /></div>
  </div>
)

export default function HUD({ stats, progress, chapter }) {
  return (
    <div className="grid gap-2 md:grid-cols-4">
      <Meter name="Защита" value={stats.security} max={5} color="#22C55E" />
      <Meter name="XP" value={stats.xp} max={180} color="linear-gradient(90deg,#6366F1,#8B5CF6)" />
      <Meter name="Внимательность" value={stats.focus} max={5} color="#06B6D4" />
      <Meter name="Риск" value={stats.risk} max={35} color="#F43F5E" />
      <div className="glass-card md:col-span-4 rounded-2xl p-3 text-xs text-slate-300">
        <div className="mb-2 flex justify-between"><span>{chapter}</span><span>Прогресс: {progress}%</span></div>
        <div className="h-2 rounded-full bg-white/10"><motion.div className="h-2 rounded-full bg-gradient-to-r from-accentCyan to-glowPurple" animate={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  )
}
