export default function FinalScreen({ ending, stats, mistakes, achievementCards, onRestart }) {
  const top = Object.entries(mistakes).sort((a,b)=>b[1]-a[1]).slice(0,3)
  return (
    <section className="space-y-4">
      <div className="glass-card rounded-3xl p-6 text-center"><h2 className="title-gradient mb-2 text-4xl font-black">{ending[0]} концовка</h2><p className="text-slate-300">{ending[1]}</p></div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="glass-card rounded-2xl p-4"><p className="text-slate-400">Правильных решений</p><p className="text-2xl font-bold">{stats.safe}</p></div>
        <div className="glass-card rounded-2xl p-4"><p className="text-slate-400">Опасных решений</p><p className="text-2xl font-bold">{stats.danger}</p></div>
        <div className="glass-card rounded-2xl p-4"><p className="text-slate-400">Итоговый XP</p><p className="text-2xl font-bold">{stats.xp}</p></div>
      </div>
      <div className="glass-card rounded-2xl p-4"><h3 className="mb-3 text-xl font-bold">Достижения</h3><div className="grid gap-2 md:grid-cols-2">{achievementCards.map((a)=><div key={a.id} className={`rounded-xl border p-3 ${a.unlocked?'border-successGreen/35 bg-successGreen/10':'border-white/10 bg-white/5 text-slate-500'}`}><p className="font-semibold">{a.title}</p><p className="text-sm">{a.desc}</p></div>)}</div></div>
      <div className="glass-card rounded-2xl p-4"><h3 className="mb-2 text-xl font-bold">Частые ошибки</h3><ul className="space-y-1 text-slate-300">{top.map(([k,v])=><li key={k}>{k}: {v}</li>)}</ul></div>
      <div className="flex gap-2"><button onClick={onRestart} className="rounded-xl bg-gradient-to-r from-glowIndigo to-glowPurple px-4 py-2 font-bold">Сыграть ещё раз</button><button onClick={onRestart} className="rounded-xl border border-white/20 px-4 py-2">Посмотреть советы</button></div>
    </section>
  )
}
