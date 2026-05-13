import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'

const db = () => getServiceClient()

export async function GET() {
  const { data } = await db().from('categories').select('*').order('display_order')
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const body = await req.json()
  const { data, error } = await db().from('categories').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req) {
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await db().from('categories').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
