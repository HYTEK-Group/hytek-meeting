'use client'

import { useState } from 'react'

interface Props {
  onSuccess: (pin: string) => void
  onBack: () => void
}

export default function PinScreen({ onSuccess, onBack }: Props) {
  const [digits, setDigits] = useState('')
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  async function handleKey(d: string) {
    if (digits.length >= 4) return
    const next = digits + d
    setDigits(next)
    if (next.length === 4) {
      setTimeout(async () => {
        const res = await fetch('/api/pin', { headers: { 'x-owner-pin': next } })
        const { valid } = await res.json()
        if (valid) {
          onSuccess(next)
        } else {
          setError('Incorrect PIN — try again')
          setDigits('')
          setShaking(true)
          setTimeout(() => setShaking(false), 400)
        }
      }, 120)
    }
  }

  return (
    <div className="flex flex-col min-h-dvh px-5">
      <button onClick={onBack} className="flex items-center gap-1.5 pt-3 pb-1 text-sm" style={{ color:'var(--text-dim)', background:'none', border:'none' }}>
        ← Back
      </button>

      <div className="text-center pt-12 pb-6">
        <h2 className="text-2xl font-bold">Owner PIN</h2>
        <p className="mt-2 text-sm" style={{ color:'var(--text-dim)' }}>Enter your 4-digit PIN</p>
      </div>

      <div className={`flex justify-center gap-4 my-7 ${shaking ? 'animate-shake' : ''}`}>
        {[0,1,2,3].map(i => (
          <div key={i} className="w-5 h-5 rounded-full border-2 transition-all"
               style={{ background: i < digits.length ? 'var(--accent)' : 'transparent',
                        borderColor: i < digits.length ? 'var(--accent)' : '#444' }} />
        ))}
      </div>

      <div className="min-h-5 text-center text-sm mb-6" style={{ color:'var(--danger)' }}>{error}</div>

      <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <button key={d} onClick={() => handleKey(d)}
            className="rounded-xl h-[68px] text-2xl font-semibold active:scale-[0.93] transition-transform"
            style={{ background:'var(--card2)', border:'none', color:'var(--text)' }}>
            {d}
          </button>
        ))}
        <div />
        <button onClick={() => handleKey('0')}
          className="rounded-xl h-[68px] text-2xl font-semibold active:scale-[0.93] transition-transform"
          style={{ background:'var(--card2)', border:'none', color:'var(--text)' }}>
          0
        </button>
        <button onClick={() => setDigits(d => d.slice(0,-1))}
          className="rounded-xl h-[68px] text-xl active:scale-[0.93] transition-transform"
          style={{ background:'var(--card2)', border:'none', color:'var(--text)' }}>
          ⌫
        </button>
      </div>
    </div>
  )
}
