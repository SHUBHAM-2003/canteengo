import { NextResponse } from 'next/server'
import { serviceClient } from '@/lib/serverClient'
import { createServerSupabase } from '@/lib/serverSupabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    let query = serviceClient.from('orders').select('*').order('created_at', { ascending: false })
    
    if (searchParams.get('status')) query = query.eq('order_status', searchParams.get('status'))
    if (searchParams.get('payment_mode')) query = query.eq('payment_mode', searchParams.get('payment_mode'))
    if (searchParams.get('limit')) query = query.limit(parseInt(searchParams.get('limit')))
    
    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message, data: [] }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err) { return NextResponse.json({ error: err.message, data: [] }, { status: 500 }) }
}

export async function POST(req) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated. Please login first.' }, { status: 401 })
    
    const body = await req.json()
    
    const today = new Date().toISOString().split('T')[0]
    const { data: seq } = await serviceClient
      .from('daily_sequences').select('last_sequence').eq('date', today).single()
    
    let newSeq = 1
    if (seq) {
      newSeq = (seq.last_sequence || 0) + 1
      await serviceClient.from('daily_sequences').update({ last_sequence: newSeq }).eq('date', today)
    } else {
      await serviceClient.from('daily_sequences').insert({ date: today, last_sequence: 1 })
    }
    
    const seqStr = String(newSeq).padStart(3, '0')
    const tableNum = body.table_number ? String(body.table_number).replace('Table ', '').replace('📍 ', '') : null
    const orderNumber = tableNum ? `T${tableNum}-${seqStr}` : `WI-${seqStr}`
    
    const { data, error } = await serviceClient.from('orders').insert({
      order_number: orderNumber,
      table_number: body.table_number || 'Walk-in',
      user_id: user.id,
      items: body.items || [],
      total_amount: body.total_amount || 0,
      payment_mode: body.payment_mode || 'counter',
      payment_status: body.payment_mode === 'online' ? 'paid' : 'pending',
      order_status: 'placed'
    }).select().single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
