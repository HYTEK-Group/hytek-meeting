'use client'

import { useEffect, useRef } from 'react'

interface Props {
  value: number  // e.g. 42.67 (dollars.cents)
}

export default function OdometerDisplay({ value }: Props) {
  const capped = Math.min(value, 9999.99)
  const str = capped.toFixed(2).replace('.', '').padStart(6, '0')
  const prevRef = useRef<string[]>(['0','0','0','0','0','0'])
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    for (let i = 0; i < 6; i++) {
      if (str[i] !== prevRef.current[i]) {
        const el = cellRefs.current[i]
        if (el) {
          el.style.transform = 'translateY(-5px) scale(1.05)'
          setTimeout(() => { if (el) el.style.transform = 'translateY(0) scale(1)' }, 80)
        }
        prevRef.current[i] = str[i]
      }
    }
  }, [str])

  const dollarDigits = [0,1,2,3]
  const centDigits   = [4,5]

  return (
    <div className="flex items-end gap-0.5">
      {/* Dollar digits */}
      <div className="flex gap-0.5">
        {dollarDigits.map(i => (
          <div
            key={i}
            className="flex items-center justify-center overflow-hidden rounded-lg"
            style={{ width:46, height:74, background:'#0a0a0a', border:'1px solid #1a1a1a' }}
          >
            <div
              ref={el => { cellRefs.current[i] = el }}
              style={{
                fontSize:50, fontWeight:900, fontFamily:"'Courier New',monospace",
                color:'#00ff88', lineHeight:1,
                textShadow:'0 0 24px rgba(0,255,136,0.6)',
                transition:'transform 0.07s ease-in-out',
              }}
            >
              {str[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Decimal point */}
      <div style={{ fontSize:56, fontWeight:900, fontFamily:"'Courier New',monospace", color:'#2a2a2a', lineHeight:1, paddingBottom:2 }}>
        .
      </div>

      {/* Cent digits */}
      <div className="flex gap-0.5">
        {centDigits.map(i => (
          <div
            key={i}
            className="flex items-center justify-center overflow-hidden rounded-lg"
            style={{ width:38, height:62, background:'#0a0a0a', border:'1px solid #1a1a1a' }}
          >
            <div
              ref={el => { cellRefs.current[i] = el }}
              style={{
                fontSize:42, fontWeight:900, fontFamily:"'Courier New',monospace",
                color:'#00cc66', lineHeight:1,
                textShadow:'0 0 16px rgba(0,204,102,0.4)',
                transition:'transform 0.07s ease-in-out',
              }}
            >
              {str[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
