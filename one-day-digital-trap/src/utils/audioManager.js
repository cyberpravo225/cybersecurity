const KEY = 'digital_trap_audio_settings'

class AudioManager {
  constructor() {
    this.muted = false
    this.volume = 0.55
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
      this.muted = !!raw.muted
      if (typeof raw.volume === 'number') this.volume = raw.volume
    } catch {}
  }

  save() {
    localStorage.setItem(KEY, JSON.stringify({ muted: this.muted, volume: this.volume }))
  }

  setMuted(next) { this.muted = next; this.save() }
  setVolume(next) { this.volume = next; this.save() }

  play(type = 'click') {
    if (this.muted) return
    const presets = {
      yawn: [180, 0.35, 'triangle'], click: [520, 0.07, 'sine'], sms: [900, 0.08, 'square'],
      email: [540, 0.08, 'triangle'], call: [380, 0.14, 'sine'], success: [760, 0.1, 'triangle'],
      error: [200, 0.12, 'sawtooth'], whoosh: [310, 0.12, 'sine'], ambient: [120, 0.2, 'sine'],
    }
    const [freq, dur, wave] = presets[type] || presets.click
    try {
      const ctx = this.ctx || (this.ctx = new (window.AudioContext || window.webkitAudioContext)())
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = wave
      osc.frequency.value = freq
      gain.gain.value = Math.min(0.12, this.volume * 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + dur)
    } catch {}
  }
}

export const audio = new AudioManager()
