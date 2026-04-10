import { Volume2, VolumeX } from 'lucide-react'

export default function SoundControls({ muted, volume, onMute, onVolume }) {
  return (
    <div className="glass-card fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl px-3 py-2">
      <button onClick={onMute} className="rounded-lg bg-white/10 p-2 hover:bg-white/20">{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
      <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => onVolume(Number(e.target.value))} />
    </div>
  )
}
