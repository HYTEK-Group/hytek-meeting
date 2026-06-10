'use client'

import { useState } from 'react'
import type { Staff } from '@/lib/types'
import AddPersonModal from './AddPersonModal'

interface Props {
  pin: string
  staff: Staff[]
  onRefresh: () => void
  onViewLog: () => void
  onHome: () => void
}

export default function OwnerStaffScreen({ pin, staff, onRefresh, onViewLog, onHome }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function deleteStaff(id: string) {
    if (!confirm('Remove this person?')) return
    setDeleting(id)
    await fetch(`/api/staff/${id}`, { method: 'DELETE', headers: { 'x-owner-pin': pin } })
    setDeleting(null)
    onRefresh()
  }

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-24">
      <div className="flex items-center justify-between py-6">
        <h2 className="text-2xl font-bold">Staff Directory</h2>
        <button onClick={onHome} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background:'var(--card2)', border:'none', color:'var(--text)' }}>✕</button>
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        {staff.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color:'var(--text-dim)' }}>
            <span className="text-5xl">👥</span>
            <p className="text-sm text-center">No staff yet. Tap + to add someone.</p>
          </div>
        ) : staff.map(p => (
          <div key={p.id} className="flex items-center justify-between rounded-xl p-4" style={{ background:'var(--card)' }}>
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm font-semibold mt-0.5" style={{ color:'var(--accent)' }}>
                ${p.rate}/hr · ${(p.rate/3600).toFixed(4)}/sec
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(p.id); setShowAdd(true) }}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-base"
                style={{ background:'var(--card2)', border:'none', color:'var(--text)' }}>✏️</button>
              <button onClick={() => deleteStaff(p.id)} disabled={deleting === p.id}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-base"
                style={{ background:'var(--card2)', border:'none', color:'var(--danger)', opacity: deleting === p.id ? 0.5 : 1 }}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5" style={{ borderTop:'1px solid #282828' }}>
        <p className="text-xs uppercase tracking-wide mb-2.5" style={{ color:'#555' }}>Settings</p>
        <button onClick={onViewLog} className="w-full flex items-center justify-between rounded-xl p-4 mb-2"
                style={{ background:'var(--card)', border:'none', color:'var(--text)' }}>
          <span>📋 Meeting Log</span><span style={{ color:'var(--text-dim)' }}>›</span>
        </button>
        <p className="text-xs text-center mt-1.5" style={{ color:'#555' }}>{staff.length} staff in directory</p>
      </div>

      {/* FAB */}
      <button onClick={() => { setEditingId(null); setShowAdd(true) }}
        className="fixed bottom-7 right-6 w-14 h-14 rounded-full flex items-center justify-center text-3xl font-light"
        style={{ background:'var(--accent)', border:'none', color:'#000', boxShadow:'0 4px 20px rgba(255,203,5,0.4)' }}>
        +
      </button>

      {showAdd && (
        <AddPersonModal
          pin={pin}
          staff={staff}
          editingId={editingId}
          onSaved={() => { setShowAdd(false); setEditingId(null); onRefresh() }}
          onClose={() => { setShowAdd(false); setEditingId(null) }}
        />
      )}
    </div>
  )
}
