import { NextResponse } from 'next/server'
import { createRouteHandlerSupabase } from '@/lib/serverSupabase'

export async function POST(req) {
  const formData = await req.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  
  const { supabase, response } = await createRouteHandlerSupabase(req)
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    return NextResponse.redirect(new URL('/login?error=Invalid+credentials', req.url))
  }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
  
  const redirectUrl = profile?.role === 'manager' ? '/manager' : '/menu'
  const redirectRes = NextResponse.redirect(new URL(redirectUrl, req.url))
  
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    redirectRes.cookies.set('sb-access-token', session.access_token, { path: '/', httpOnly: true, sameSite: 'lax' })
    redirectRes.cookies.set('sb-refresh-token', session.refresh_token, { path: '/', httpOnly: true, sameSite: 'lax' })
  }
  
  return redirectRes
}
