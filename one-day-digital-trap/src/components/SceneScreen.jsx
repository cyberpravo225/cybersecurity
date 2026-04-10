import { motion } from 'framer-motion'

export default function SceneScreen({ scene, helpMode, onPick }) {
  return (
    <motion.section key={scene.id} initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="glass-card rounded-3xl p-6">
      <div className="mb-4 flex justify-between text-xs text-slate-400"><span className="rounded-full bg-white/10 px-2 py-1">{scene.chapter}</span><span>{scene.ui.toUpperCase()}</span></div>
      <h2 className="mb-2 text-2xl font-bold">{scene.title}</h2>
      <p className="mb-3 text-slate-300">{scene.text}</p>
      {helpMode && <p className="mb-4 rounded-xl border border-accentCyan/30 bg-accentCyan/10 p-2 text-sm text-cyan-100"><b>Подсказка:</b> {scene.hint}</p>}
      <div className="grid gap-3">{scene.choices.map((choice, i) => <button key={i} onClick={()=>onPick(choice)} className="glass-card rounded-xl border border-white/15 p-3 text-left transition hover:scale-[1.01]">{choice[0]}</button>)}</div>
    </motion.section>
  )
}
