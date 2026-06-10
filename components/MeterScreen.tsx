'use client'

import { useEffect, useState, useRef } from 'react'
import type { StaffPublic } from '@/lib/types'
import OdometerDisplay from './OdometerDisplay'

interface Props {
  selected: StaffPublic[]
  ratePerSec: number
  onStop: (cost: number, duration_ms: number) => void
}

function fmtTime(ms: number) {
  const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
  return [h,m,sec].map(n => String(n).padStart(2,'0')).join(':')
}

export default function MeterScreen({ selected, ratePerSec, onStop }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    startRef.current = Date.now()
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 100)
    return () => clearInterval(id)
  }, [])

  const cost = ratePerSec * (elapsed / 1000)

  return (
    <div className="flex flex-col min-h-dvh" style={{ background:'#000' }}>
      <div className="pt-14 px-6 pb-5 text-center">
        <p className="text-xs tracking-[3px] uppercase" style={{ color:'#444' }}>Meeting in Progress</p>
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {selected.map(p => (
            <span key={p.id} className="rounded-full px-3 py-1 text-sm" style={{ background:'#1a1a1a', color:'#888' }}>
              {p.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-xs tracking-[3px] uppercase mb-5" style={{ color:'#444' }}>Total Cost</p>
        <div className="flex items-center">
          <span className="text-5xl font-black mr-1.5" style={{ fontFamily:"'Courier New',monospace", color:'#3a3a3a', lineHeight:1 }}>$</span>
          <OdometerDisplay value={cost} />
        </div>
        <p className="mt-5 text-sm" style={{ color:'#333' }}>
          ${ratePerSec.toFixed(4)} per second
        </p>
        <p className="mt-2.5 text-3xl font-bold tracking-[2px]"
           style={{ fontFamily:"'Courier New',monospace", color:'#2a2a2a' }}>
          {fmtTime(elapsed)}
        </p>
      </div>

      <div className="px-6 pb-12">
        <button onClick={() => onStop(cost, elapsed)}
          className="w-full rounded-2xl py-5 text-xl font-black tracking-[2px] active:scale-[0.97] transition-transform"
          style={{ background:'#cc0000', border:'none', color:'#fff', boxShadow:'0 4px 24px rgba(204,0,0,0.35)' }}>
          &#9632; STOP
        </button>
      </div>
    </div>
  )
}
