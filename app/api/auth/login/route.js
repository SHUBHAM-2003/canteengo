import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'

const db = () => getServiceClient()

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    
    const { data, error } = await db().auth.signInWithPassword({ email, password })
    
    if (error) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const { data: profile } = await db()
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()
    
    return NextResponse.json({
      user: { id: data.user.id, email: data.user.email },
      role: profile?.role || 'student',
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
