export default function StartScreen({ onStart, onRules }) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <h1 className="title-gradient mb-4 text-5xl font-black">Один день: цифровая ловушка</h1>
      <p className="mb-8 text-slate-300">Обычный день. Обычные уведомления. Необычно высокие ставки.</p>
      <div className="glass-card rounded-3xl p-6">
        <p className="mb-6 text-slate-300">10–12 минут игры, которые помогут чаще замечать цифровые ловушки в реальной жизни.</p>
        <div className="flex justify-center gap-3">
          <button onClick={onStart} className="rounded-xl bg-gradient-to-r from-glowIndigo to-glowPurple px-5 py-3 font-bold shadow-glow">Начать игру</button>
          <button onClick={onRules} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3">Как играть</button>
        </div>
      </div>
    </section>
  )
}
