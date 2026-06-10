interface Props {
  onOwner: () => void
  onOrganiser: () => void
}

export default function HomeScreen({ onOwner, onOrganiser }: Props) {
  return (
    <div className="flex flex-col min-h-dvh px-5 pb-8">
      <div className="text-center pt-12 pb-6">
        <div className="text-5xl mb-2">💸</div>
        <h1 className="text-3xl font-black">Meeting $</h1>
        <p className="mt-1.5 text-sm" style={{ color:'var(--text-dim)' }}>Know what your meetings cost</p>
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-center py-5">
        <button
          onClick={onOwner}
          className="rounded-2xl p-7 flex items-center gap-5 text-left active:scale-[0.97] transition-transform"
          style={{ background:'var(--card)', border:'2px solid var(--accent)' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
               style={{ background:'rgba(255,203,5,0.15)' }}>👑</div>
          <div>
            <div className="text-lg font-bold">Owner</div>
            <div className="text-sm mt-1" style={{ color:'var(--text-dim)' }}>Manage staff, rates &amp; meeting log</div>
          </div>
        </button>

        <button
          onClick={onOrganiser}
          className="rounded-2xl p-7 flex items-center gap-5 text-left active:scale-[0.97] transition-transform"
          style={{ background:'var(--card)', border:'2px solid transparent' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
               style={{ background:'rgba(0,255,136,0.1)' }}>📋</div>
          <div>
            <div className="text-lg font-bold">Organise a Meeting</div>
            <div className="text-sm mt-1" style={{ color:'var(--text-dim)' }}>Select attendees &amp; start the meter</div>
          </div>
        </button>
      </div>

      <p className="text-center text-xs" style={{ color:'#444' }}>Default owner PIN: 1234</p>
    </div>
  )
}
