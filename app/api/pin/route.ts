import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple in-memory rate limiter: max 5 wrong attempts per IP per 15 min
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000  // 15 minutes

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()

  // Clean up expired entries opportunistically
  const entry = attempts.get(ip)
  if (entry && now > entry.resetAt) attempts.delete(ip)

  const current = attempts.get(ip)
  if (current && current.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((current.resetAt - now) / 1000)
    return NextResponse.json(
      { valid: false, error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    )
  }

  const pin = req.headers.get('x-owner-pin')
  const valid = pin === process.env.OWNER_PIN

  if (!valid) {
    // Record failed attempt
    const existing = attempts.get(ip)
    if (existing) {
      existing.count += 1
    } else {
      attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    }
  } else {
    // Clear on success
    attempts.delete(ip)
  }

  return NextResponse.json({ valid })
}
