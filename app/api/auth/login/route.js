import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'

const db = () => getServiceClient()

export async function POST(req) {
  try {
    const formData = await req.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    
    const { data, error } = await db().auth.signInWithPassword({ email, password })
    
    if (error) {
      return NextResponse.redirect(new URL('/login?error=Invalid+credentials', req.url))
    }
    
    const { data: profile } = await db().from('profiles').select('role').eq('id', data.user.id).single()
    
    const redirectUrl = profile?.role === 'manager' ? '/manager' : '/menu'
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  } catch (err) {
    return NextResponse.redirect(new URL('/login?error=Server+error', req.url))
  }
}
