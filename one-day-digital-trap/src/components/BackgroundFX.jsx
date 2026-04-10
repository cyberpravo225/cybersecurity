import { motion } from 'framer-motion'

export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {[['left-[8%] top-[12%] h-52 w-52 bg-glowIndigo/20'], ['right-[7%] top-[18%] h-64 w-64 bg-glowPurple/20'], ['left-[32%] bottom-[8%] h-56 w-56 bg-accentCyan/20']].map(([c], i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${c}`}
          animate={{ x: [0, 16, -8, 0], y: [0, -12, 8, 0] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
