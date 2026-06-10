import { NextResponse } from 'next/server'
import { getSupabaseAdmin, checkOwnerPin } from '@/lib/supabase-admin'
import type { Staff } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Owner only — returns names AND rates */
export async function GET(req: Request) {
  if (!checkOwnerPin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('staff')
    .select('id, name, rate')
    .order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data as Staff[])
}
