import Link from 'next/link'

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: 'white', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 440, boxShadow: '0 8px 32px rgba(0,0,0,0.16)' },
  logo: { textAlign: 'center', marginBottom: 36 },
  logoIcon: { fontSize: 48, display: 'block', marginBottom: 12 },
  h1: { fontSize: '2rem', fontWeight: 700, color: '#FF6B35', margin: 0 },
  p: { color: '#636E72', marginTop: 4, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  label: { fontWeight: 500, fontSize: 14, color: '#636E72' },
  input: { padding: '14px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16, outline: 'none' },
  btn: { background: '#FF6B35', color: 'white', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer' },
}
export default function LoginPage() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🍽️</span>
          <h1 style={styles.h1}>CanteenGo</h1>
          <p style={styles.p}>Sign in to continue</p>
        </div>
        <form style={styles.form} action="/api/auth/login" method="POST">
          <label style={styles.label}>Email</label>
          <input style={styles.input} name="email" type="email" required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} name="password" type="password" required />
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #e8e8e8', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#636E72', marginBottom: 12 }}>Demo Accounts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: '#f8f9fa', padding: '10px 16px', borderRadius: 12 }}>
              <span>student@demo.com / demo123</span>
            </div>
            <div style={{ background: '#f8f9fa', padding: '10px 16px', borderRadius: 12 }}>
              <span>manager@demo.com / demo123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
