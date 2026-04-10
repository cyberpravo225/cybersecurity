export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bgDeep: '#0B0F1A', bgSoft: '#0F172A', glowIndigo: '#6366F1', glowPurple: '#8B5CF6', successGreen: '#22C55E', dangerRose: '#F43F5E', accentCyan: '#06B6D4'
      },
      boxShadow: {
        glass: '0 18px 40px rgba(2,6,23,.45)',
        glow: '0 0 26px rgba(99,102,241,.35)'
      }
    }
  },
  plugins: [],
}
