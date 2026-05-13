'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }
      
      // Store session in sessionStorage so other pages can use it
      if (data.session) {
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=86400; samesite=lax`
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=86400; samesite=lax`
      }
      
      if (data.role === 'manager') {
        router.push('/manager')
      } else {
        router.push('/menu')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%)', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 440, boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#FF6B35', margin: 0 }}>CanteenGo</h1>
          <p style={{ color: '#636E72', marginTop: 4, fontSize: 14 }}>Sign in to continue</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && <div style={{ background: 'rgba(214,48,49,0.1)', color: '#D63031', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>{error}</div>}
          <label style={{ fontWeight: 500, fontSize: 14, color: '#636E72' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '14px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} />
          <label style={{ fontWeight: 500, fontSize: 14, color: '#636E72' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '14px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} />
          <button type="submit" disabled={loading} style={{ background: '#FF6B35', color: 'white', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #e8e8e8', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#636E72', marginBottom: 12 }}>Demo Accounts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => { setEmail('student@demo.com'); setPassword('demo123') }} style={{ background: '#f8f9fa', padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
              <span>👨‍🎓 Student</span><span style={{ color: '#FF6B35', fontWeight: 500, fontSize: 13 }}>student@demo.com</span>
            </button>
            <button onClick={() => { setEmail('manager@demo.com'); setPassword('demo123') }} style={{ background: '#f8f9fa', padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
              <span>👔 Manager</span><span style={{ color: '#FF6B35', fontWeight: 500, fontSize: 13 }}>manager@demo.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
