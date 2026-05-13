import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(req.url)
  
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  
  if (searchParams.get('status')) query = query.eq('order_status', searchParams.get('status'))
  if (searchParams.get('payment_mode')) query = query.eq('payment_mode', searchParams.get('payment_mode'))
  if (searchParams.get('limit')) query = query.limit(parseInt(searchParams.get('limit')))
  
  const { data } = await query
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  
  const today = new Date().toISOString().split('T')[0]
  const { data: seq } = await supabase
    .from('daily_sequences')
    .select('last_sequence')
    .eq('date', today)
    .single()
  
  let newSeq = 1
  if (seq) {
    newSeq = seq.last_sequence + 1
    await supabase.from('daily_sequences').update({ last_sequence: newSeq }).eq('date', today)
  } else {
    await supabase.from('daily_sequences').insert({ date: today, last_sequence: 1 })
  }
  
  const seqStr = String(newSeq).padStart(3, '0')
  const orderNumber = body.table_number ? `T${body.table_number}-${seqStr}` : `WI-${seqStr}`
  
  const { data, error } = await supabase.from('orders').insert({
    order_number: orderNumber,
    table_number: body.table_number || null,
    user_id: session.user.id,
    items: body.items,
    total_amount: body.total_amount,
    payment_mode: body.payment_mode,
    payment_status: body.payment_mode === 'online' ? 'paid' : 'pending',
    order_status: 'placed'
  }).select().single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
