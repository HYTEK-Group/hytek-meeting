import { NextResponse } from 'next/server'
import { getSupabaseAdmin, checkOwnerPin } from '@/lib/supabase-admin'
import type { StaffPublic } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Public — returns names only, no rates */
export async function GET() {
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('staff')
    .select('id, name')
    .order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data as StaffPublic[])
}

/** Owner only — add new staff member */
export async function POST(req: Request) {
  if (!checkOwnerPin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const body = await req.json()
  const { id, name, rate } = body as { id: string; name: string; rate: number }
  if (!id || !name || !rate || rate <= 0) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('staff')
    .insert({ id, name, rate })
    .select('id, name, rate')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
