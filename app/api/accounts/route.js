import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'

const db = () => getServiceClient()

export async function GET() {
  try {
    const { data: users } = await db().from('profiles').select('*').order('created_at', { ascending: false })
    return NextResponse.json(users || [])
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function POST(req) {
  try {
    const body = await req.json()
    
    const { data: authData, error: authError } = await db().auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true
    })
    
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })
    
    const { data, error } = await db().from('profiles').insert({
      id: authData.user.id,
      name: body.name,
      role: body.role
    }).select().single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}
