'use client'

import { useState } from 'react'
import type { StaffPublic } from '@/lib/types'
import { matchesQuery } from '@/lib/search'

interface Props {
  staff: StaffPublic[]
  onGo: (selectedIds: Set<string>) => void
  onBack: () => void
}

export default function OrganiserScreen({ staff, onGo, onBack }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selected   = staff.filter(p => selectedIds.has(p.id))
  const unselected = staff.filter(p => !selectedIds.has(p.id) && matchesQuery(p.name, query))

  const renderItem = (p: StaffPublic, isSelected: boolean) => (
    <button key={p.id} onClick={() => toggle(p.id)}
      className="w-full flex items-center gap-4 rounded-xl px-4 py-5 text-left transition-all"
      style={{
        background: isSelected ? 'rgba(255,203,5,0.07)' : 'var(--card)',
        border: `2px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
      }}>
      <div className="flex-shrink-0 transition-all"
           style={{
             width:26, height:26,
             background: isSelected ? 'var(--accent)' : 'transparent',
             border: `2px solid ${isSelected ? 'var(--accent)' : '#444'}`,
             borderRadius: 8,
             display:'flex', alignItems:'center', justifyContent:'center',
             fontSize:14,
             color: isSelected ? '#000' : 'transparent',
           }}>
        ✓
      </div>
      <span className="text-lg font-semibold">{p.name}</span>
    </button>
  )

  return (
    <div className="flex flex-col min-h-dvh px-5">
      <button onClick={onBack} className="flex items-center gap-1.5 pt-3 pb-1 text-sm"
              style={{ background:'none', border:'none', color:'var(--text-dim)' }}>← Back</button>

      <div className="mb-3">
        <h2 className="text-2xl font-bold">Who&apos;s in this meeting?</h2>
        <p className="text-sm mt-1" style={{ color:'var(--text-dim)' }}>Search and tap to select</p>
      </div>

      <div className="relative mb-3 flex-shrink-0">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color:'#555' }}>🔍</span>
        <input
          className="w-full rounded-xl pl-10 pr-4 py-3.5 text-base outline-none"
          style={{ background:'var(--card)', border:'1.5px solid #2a2a2a', color:'var(--text)' }}
          placeholder="Type a name…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto pb-32">
        {selected.map(p => renderItem(p, true))}
        {selected.length > 0 && unselected.length > 0 && (
          <div className="h-px my-1" style={{ background:'#1f1f1f' }} />
        )}
        {unselected.map(p => renderItem(p, false))}
        {unselected.length === 0 && selected.length === 0 && (
          <p className="text-center py-6 text-sm" style={{ color:'var(--text-dim)' }}>
            No match for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* GO bar */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-9 pt-4"
           style={{ background:'linear-gradient(to top, var(--bg) 65%, transparent)' }}>
        <button onClick={() => onGo(selectedIds)} disabled={selectedIds.size === 0}
          className="w-full rounded-2xl py-5 text-xl font-black tracking-widest transition-all active:scale-[0.97]"
          style={{ background:'var(--accent)', border:'none', color:'#000', opacity: selectedIds.size === 0 ? 0.25 : 1 }}>
          GO
        </button>
        <p className="text-center text-sm mt-2" style={{ color:'var(--text-dim)' }}>
          {selectedIds.size === 0
            ? 'Search and select attendees'
            : `${selectedIds.size} person${selectedIds.size > 1 ? 's' : ''} selected`}
        </p>
      </div>
    </div>
  )
}
