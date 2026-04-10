export default function ResultScreen({ last, onNext }) {
  const safe = last.risk === 'low'
  return (
    <section className="glass-card rounded-3xl p-6">
      <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs ${safe?'bg-successGreen/20 text-green-200':'bg-dangerRose/20 text-rose-200'}`}>{safe?'Удачное решение':'Рискованное решение'}</span>
      <p className="mb-2 text-slate-200">{last.explain}</p>
      <p className="mb-3 text-sm text-slate-400">Тип угрозы: {last.threat}</p>
      {last.repeat && <p className="mb-3 rounded-xl border border-dangerRose/40 bg-dangerRose/10 p-2 text-sm text-rose-200">Это повторная ошибка такого же типа — риск растёт.</p>}
      <button onClick={onNext} className="rounded-xl bg-gradient-to-r from-glowIndigo to-glowPurple px-4 py-2 font-bold">Дальше</button>
    </section>
  )
}
