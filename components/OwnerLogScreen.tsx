'use client'

import { useState, useEffect } from 'react'
import type { MeetingLog } from '@/lib/types'

interface Props {
  pin: string
  onBack: () => void
}

function fmtTime(ms: number) {
  const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
  return [h,m,sec].map(n => String(n).padStart(2,'0')).join(':')
}

export default function OwnerLogScreen({ pin, onBack }: Props) {
  const [log, setLog] = useState<MeetingLog[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchLog() {
    setLoading(true)
    const res = await fetch('/api/log', { headers: { 'x-owner-pin': pin } })
    const data = await res.json()
    setLog(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchLog() }, [])

  async function clearAll() {
    if (!confirm('Clear all meeting history? This cannot be undone.')) return
    await fetch('/api/log', { method: 'DELETE', headers: { 'x-owner-pin': pin } })
    setLog([])
  }

  const grandTotal = log.reduce((s, e) => s + Number(e.cost), 0)

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-8">
      <div className="flex items-center justify-between py-6 flex-shrink-0">
        <h2 className="text-2xl font-bold">Meeting Log</h2>
        <button onClick={onBack} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background:'var(--card2)', border:'none', color:'var(--text)' }}>←</button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center" style={{ color:'var(--text-dim)' }}>Loading…</div>
      ) : log.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color:'var(--text-dim)' }}>
          <span className="text-5xl">📋</span>
          <p className="text-sm">No meetings logged yet.</p>
        </div>
      ) : (
        <>
          {/* Grand total bar */}
          <div className="flex justify-between items-center rounded-xl p-4 mb-4 flex-shrink-0"
               style={{ background:'var(--card)' }}>
            <span className="text-sm" style={{ color:'var(--text-dim)' }}>All meetings total</span>
            <span className="text-lg font-bold" style={{ fontFamily:"'Courier New',monospace", color:'var(--accent)' }}>
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pb-16">
            {log.map(entry => {
              const d = new Date(entry.created_at)
              const dateStr = d.toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short', year:'numeric' })
              const timeStr = d.toLocaleTimeString('en-AU', { hour:'2-digit', minute:'2-digit' })
              return (
                <div key={entry.id} className="rounded-xl p-4" style={{ background:'var(--card)' }}>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-sm" style={{ color:'var(--text-dim)' }}>{dateStr} at {timeStr}</span>
                    <span className="text-xl font-black" style={{ fontFamily:"'Courier New',monospace", color:'var(--accent)' }}>
                      ${Number(entry.cost).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color:'#555' }}>Duration: {fmtTime(entry.duration_ms)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.attendees.map((name, i) => (
                      <span key={i} className="rounded-full px-2.5 py-1 text-xs" style={{ background:'var(--card2)', color:'var(--text-dim)' }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <button onClick={clearAll} className="self-center mt-4 px-5 py-2.5 rounded-xl text-sm"
                  style={{ background:'none', border:`1px solid var(--danger)`, color:'var(--danger)' }}>
            Clear All Meetings
          </button>
        </>
      )}
    </div>
  )
}
