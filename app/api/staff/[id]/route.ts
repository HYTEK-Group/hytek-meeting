import { NextResponse } from 'next/server'
import { getSupabaseAdmin, checkOwnerPin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkOwnerPin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { name, rate } = body as { name: string; rate: number }
  if (!name || !rate || rate <= 0) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('staff')
    .update({ name, rate })
    .eq('id', id)
    .select('id, name, rate')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkOwnerPin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  const db = getSupabaseAdmin()
  const { error } = await db.from('staff').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
