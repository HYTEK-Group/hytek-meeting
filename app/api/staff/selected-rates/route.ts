import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

/** Returns combined $/sec for selected staff IDs. No PIN required — only sum is returned, not individual rates. */
export async function POST(req: Request) {
  const { ids } = await req.json() as { ids: string[] }
  if (!ids?.length) return NextResponse.json({ rate: 0 })
  const db = getSupabaseAdmin()
  const { data, error } = await db.from('staff').select('rate').in('id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const ratePerSec = (data ?? []).reduce((sum, row) => sum + Number(row.rate) / 3600, 0)
  return NextResponse.json({ rate: ratePerSec })
}
