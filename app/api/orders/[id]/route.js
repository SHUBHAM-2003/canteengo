import { NextResponse } from 'next/server'
import { serviceClient } from '@/lib/serverClient'

export async function GET(req, { params }) {
  try {
    const { id } = params
    const { data, error } = await serviceClient.from('orders').select('*').eq('id', id).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json()
    const { id } = params
    const { data, error } = await serviceClient.from('orders').update(body).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}
