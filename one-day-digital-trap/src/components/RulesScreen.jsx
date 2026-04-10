export default function RulesScreen({ difficulty, setDifficulty, helpMode, setHelpMode, onStart, onBack }) {
  return (
    <section className="mx-auto max-w-3xl glass-card rounded-3xl p-6">
      <h2 className="mb-3 text-2xl font-bold">Как играть</h2>
      <ul className="mb-4 list-disc space-y-2 pl-5 text-slate-300">
        <li>В каждой сцене выбирай действие и смотри последствия.</li>
        <li>Береги защиту, накапливай XP и следи за риском.</li>
        <li>После каждого выбора получаешь короткий разбор.</li>
        <li>Есть 4 концовки — перепройди и улучши результат.</li>
      </ul>
      <div className="mb-4 flex gap-2">
        {['easy','normal','hard'].map((d) => (
          <button key={d} onClick={() => setDifficulty(d)} className={`rounded-lg px-3 py-2 ${difficulty===d?'bg-glowPurple/30 border border-glowPurple':'bg-white/5 border border-white/10'}`}>{d}</button>
        ))}
      </div>
      <label className="mb-5 flex items-center gap-2 text-slate-300"><input type="checkbox" checked={helpMode} onChange={(e)=>setHelpMode(e.target.checked)} /> Режим помощи</label>
      <div className="flex gap-2"><button className="rounded-xl bg-gradient-to-r from-glowIndigo to-glowPurple px-4 py-2" onClick={onStart}>Старт</button><button className="rounded-xl border border-white/20 px-4 py-2" onClick={onBack}>Назад</button></div>
    </section>
  )
}
