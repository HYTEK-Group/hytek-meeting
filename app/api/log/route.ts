import { NextResponse } from 'next/server'
import { getSupabaseAdmin, checkOwnerPin } from '@/lib/supabase-admin'
import type { MeetingLog } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Owner only — get full log */
export async function GET(req: Request) {
  if (!checkOwnerPin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('meeting_log')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data as MeetingLog[])
}

/** Open — anyone can save a meeting (organiser has no PIN) */
export async function POST(req: Request) {
  const body = await req.json()
  const { attendees, duration_ms, cost } = body as {
    attendees: string[]
    duration_ms: number
    cost: number
  }
  if (!attendees?.length || !duration_ms || !cost) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('meeting_log')
    .insert({ attendees, duration_ms, cost })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

/** Owner only — clear entire log */
export async function DELETE(req: Request) {
  if (!checkOwnerPin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const db = getSupabaseAdmin()
  const { error } = await db.from('meeting_log').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
