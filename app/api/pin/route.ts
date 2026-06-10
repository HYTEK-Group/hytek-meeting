import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const pin = req.headers.get('x-owner-pin')
  const valid = pin === process.env.OWNER_PIN
  return NextResponse.json({ valid })
}
