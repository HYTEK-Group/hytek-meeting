'use client'

import { useState } from 'react'
import type { StaffPublic } from '@/lib/types'
import { matchesQuery } from '@/lib/search'

interface Props {
  staff: StaffPublic[]
  onGo: (selectedIds: Set<string>) => void
  onOwner: () => void
}

export default function OrganiserScreen({ staff, onGo, onOwner }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isSearching = query.trim().length > 0
  // While searching: every person matching the query, at the top under the box (ticked state shown).
  const matches = staff.filter(p => matchesQuery(p.name, query))
  // While browsing (empty box): the people you've already picked first, then everyone else.
  const picked    = staff.filter(p => selectedIds.has(p.id))
  const notPicked = staff.filter(p => !selectedIds.has(p.id))

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
      <div className="flex items-start justify-between pt-4">
        <div>
          <h2 className="text-2xl font-bold">Who&apos;s in the meeting?</h2>
          <p className="text-sm mt-1" style={{ color:'var(--text-dim)' }}>Type a name or scroll, then tap</p>
        </div>
        <button onClick={onOwner} aria-label="Owner settings"
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg mt-0.5"
                style={{ background:'var(--card2)', border:'none', color:'var(--text-dim)' }}>⚙</button>
      </div>
      <div className="mb-1" />

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
        {isSearching ? (
          matches.length === 0 ? (
            <p className="text-center py-6 text-sm" style={{ color:'var(--text-dim)' }}>
              No match for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              {selectedIds.size > 0 && (
                <p className="text-xs px-1 pb-1" style={{ color:'var(--text-dim)' }}>
                  {selectedIds.size} already picked — keep typing to add the next person
                </p>
              )}
              {matches.map(p => renderItem(p, selectedIds.has(p.id)))}
            </>
          )
        ) : (
          <>
            {picked.map(p => renderItem(p, true))}
            {picked.length > 0 && notPicked.length > 0 && (
              <div className="h-px my-1" style={{ background:'#1f1f1f' }} />
            )}
            {notPicked.map(p => renderItem(p, false))}
          </>
        )}
      </div>

      {/* GO bar */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-9 pt-4"
           style={{ background:'linear-gradient(to top, var(--bg) 65%, transparent)' }}>
        <button onClick={() => onGo(selectedIds)} disabled={selectedIds.size === 0}
          className="w-full rounded-2xl py-5 text-xl font-black tracking-wide transition-all active:scale-[0.97]"
          style={{ background:'var(--accent)', border:'none', color:'#000', opacity: selectedIds.size === 0 ? 0.25 : 1 }}>
          ▶ START MEETING
        </button>
        <p className="text-center text-sm mt-2" style={{ color:'var(--text-dim)' }}>
          {selectedIds.size === 0
            ? 'Tap the people in the meeting'
            : `${selectedIds.size} ${selectedIds.size > 1 ? 'people' : 'person'} selected — ready to start`}
        </p>
      </div>
    </div>
  )
}
