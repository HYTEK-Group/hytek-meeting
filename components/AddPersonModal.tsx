'use client'

import { useState, useEffect } from 'react'
import type { Staff } from '@/lib/types'
import { matchesQuery } from '@/lib/search'

interface Props {
  pin: string
  staff: Staff[]
  editingId: string | null
  onSaved: () => void
  onClose: () => void
}

export default function AddPersonModal({ pin, staff, editingId, onSaved, onClose }: Props) {
  const [mode, setMode] = useState<'search' | 'manual'>(editingId ? 'manual' : 'search')
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [rate, setRate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingId) {
      const p = staff.find(s => s.id === editingId)
      if (p) { setName(p.name); setRate(String(p.rate)) }
    }
  }, [editingId, staff])

  const searchResults = staff.filter(p => matchesQuery(p.name, query))

  async function save() {
    if (!name.trim() || !rate || Number(rate) <= 0) return
    setSaving(true)
    const r = parseFloat(rate)
    const headers = { 'Content-Type': 'application/json', 'x-owner-pin': pin }
    if (editingId) {
      await fetch(`/api/staff/${editingId}`, {
        method: 'PUT', headers, body: JSON.stringify({ name: name.trim(), rate: r }),
      })
    } else {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2,6)
      await fetch('/api/staff', {
        method: 'POST', headers, body: JSON.stringify({ id, name: name.trim(), rate: r }),
      })
    }
    setSaving(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background:'rgba(0,0,0,0.78)' }}
         onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full rounded-t-3xl p-5 pb-11 animate-slide-up flex flex-col"
           style={{ background:'#1c1c1e', maxHeight:'88dvh' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5 flex-shrink-0" style={{ background:'#3a3a3c' }} />
        <h3 className="text-lg font-bold mb-4 flex-shrink-0">
          {editingId ? 'Edit Person' : 'Add Person'}
        </h3>

        {mode === 'search' && !editingId ? (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="relative flex-shrink-0 mb-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color:'#555' }}>🔍</span>
              <input
                autoFocus
                className="w-full rounded-xl pl-10 pr-4 py-3.5 text-base outline-none"
                style={{ background:'#2c2c2e', border:'1.5px solid #3a3a3c', color:'var(--text)' }}
                placeholder="Type a name…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto mt-2 min-h-0">
              {searchResults.length === 0 ? (
                <p className="text-center py-6 text-sm" style={{ color:'var(--text-dim)' }}>
                  {query ? `No match for "${query}"` : 'No staff in directory'}
                </p>
              ) : searchResults.map(p => (
                <button key={p.id}
                  onClick={() => { setName(p.name); setRate(String(p.rate)); setMode('manual') }}
                  className="w-full flex justify-between items-center px-3.5 py-4 rounded-xl mb-0.5 text-left active:bg-neutral-800 transition-colors"
                >
                  <span className="text-base font-medium">{p.name}</span>
                  <span className="text-sm font-semibold" style={{ color:'var(--accent)' }}>${p.rate}/hr</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2.5 my-3 flex-shrink-0">
              <div className="flex-1 h-px" style={{ background:'#2a2a2a' }} />
              <span className="text-xs" style={{ color:'#555' }}>Not in directory?</span>
              <div className="flex-1 h-px" style={{ background:'#2a2a2a' }} />
            </div>
            <button onClick={() => { setName(''); setRate(''); setMode('manual') }}
              className="w-full rounded-xl py-3.5 text-sm flex-shrink-0"
              style={{ background:'#2c2c2e', border:'none', color:'var(--text-dim)' }}>
              + Add manually
            </button>
          </div>
        ) : (
          <div>
            {!editingId && (
              <button onClick={() => setMode('search')} className="flex items-center gap-1 text-sm mb-3 pb-1"
                      style={{ background:'none', border:'none', color:'var(--text-dim)' }}>
                ← Back to search
              </button>
            )}
            <div className="mb-3.5">
              <label className="block text-xs uppercase tracking-wide mb-2" style={{ color:'var(--text-dim)' }}>Full Name</label>
              <input autoFocus className="w-full rounded-xl px-4 py-3.5 text-base outline-none"
                     style={{ background:'#2c2c2e', border:'1.5px solid #3a3a3c', color:'var(--text)' }}
                     placeholder="e.g. Sarah Johnson" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mb-3.5">
              <label className="block text-xs uppercase tracking-wide mb-2" style={{ color:'var(--text-dim)' }}>Hourly Rate ($/hr)</label>
              <input type="number" inputMode="decimal" min="0" step="any"
                     className="w-full rounded-xl px-4 py-3.5 text-base outline-none"
                     style={{ background:'#2c2c2e', border:'1.5px solid #3a3a3c', color:'var(--text)' }}
                     placeholder="e.g. 120" value={rate} onChange={e => setRate(e.target.value)} />
            </div>
            <div className="flex gap-2.5 mt-4">
              <button onClick={onClose} className="flex-1 rounded-xl py-4 text-base"
                      style={{ background:'#2c2c2e', border:'none', color:'var(--text)' }}>Cancel</button>
              <button onClick={save} disabled={saving} className="flex-[2] rounded-xl py-4 text-base font-bold"
                      style={{ background:'var(--accent)', border:'none', color:'#000', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
