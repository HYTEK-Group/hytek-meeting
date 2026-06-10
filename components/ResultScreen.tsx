interface Props {
  cost: number
  duration_ms: number
  attendees: string[]
  onNewMeeting: () => void
  onHome: () => void
}

function fmtTime(ms: number) {
  const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
  return [h,m,sec].map(n => String(n).padStart(2,'0')).join(':')
}

export default function ResultScreen({ cost, duration_ms, attendees, onNewMeeting, onHome }: Props) {
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center text-center px-5 gap-5">
      <span className="text-6xl">💸</span>
      <p className="text-xs uppercase tracking-[3px]" style={{ color:'var(--text-dim)' }}>Meeting Cost</p>
      <p className="text-6xl font-black leading-none" style={{ fontFamily:"'Courier New',monospace", color:'var(--accent)' }}>
        ${cost.toFixed(2)}
      </p>
      <p className="text-sm" style={{ color:'var(--text-dim)' }}>Duration: {fmtTime(duration_ms)}</p>
      <p className="text-xs flex items-center gap-1.5" style={{ color:'#555' }}>✅ Saved to owner log</p>
      <div className="flex flex-wrap justify-center gap-2 max-w-xs">
        {attendees.map((name, i) => (
          <span key={i} className="rounded-full px-3.5 py-1.5 text-sm" style={{ background:'var(--card)' }}>{name}</span>
        ))}
      </div>
      <button onClick={onNewMeeting}
        className="w-full max-w-xs rounded-xl py-4 text-base font-bold mt-2"
        style={{ background:'var(--accent)', border:'none', color:'#000' }}>
        Start New Meeting
      </button>
      <button onClick={onHome} className="text-sm py-2.5" style={{ background:'none', border:'none', color:'#444' }}>
        Back to Home
      </button>
    </div>
  )
}
