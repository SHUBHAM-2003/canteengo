'use client'
import { useState, useEffect } from 'react'

const s = {
  page: { minHeight: '100vh' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoText: { fontSize: '1.5rem', fontWeight: 700, color: '#FF6B35', margin: 0 },
  hero: { textAlign: 'center', padding: '80px 20px 60px', background: 'linear-gradient(180deg, #FF6B35 0%, #E55A2B 100%)', color: 'white' },
  heroH1: { fontSize: '3rem', fontWeight: 700, margin: '0 0 16px' },
  heroP: { fontSize: '1.2rem', opacity: 0.9, margin: '0 0 32px' },
  cta: { background: 'white', color: '#FF6B35', padding: '16px 48px', borderRadius: 24, fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
  features: { display: 'flex', justifyContent: 'center', gap: 32, padding: '60px 40px', flexWrap: 'wrap' },
  featureCard: { background: 'white', padding: 32, borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', width: 280 },
  footer: { textAlign: 'center', padding: 40, background: '#2D3436', color: 'white' }
}

export default function HomePage() {
  const [banners, setBanners] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [showMood, setShowMood] = useState(false)
  const [moodToast, setMoodToast] = useState('')

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then(data => setBanners(data.filter(b => b.is_active)))
      .catch(() => {})
    
    const lastShown = localStorage.getItem('moodShown')
    if (lastShown !== new Date().toDateString()) {
      setTimeout(() => setShowMood(true), 1500)
    }
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setCurrentBanner(prev => (prev + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [banners.length])

  const handleMood = (msg) => {
    setShowMood(false)
    localStorage.setItem('moodShown', new Date().toDateString())
    setMoodToast(msg)
    setTimeout(() => setMoodToast(''), 4000)
  }

  const moods = [
    { emoji: '😄', label: 'Awesome', msg: "Love that energy! Treat yourself today 🎉" },
    { emoji: '😊', label: 'Nice', msg: "Good to hear! Enjoy your meal 😊" },
    { emoji: '😎', label: 'Cool', msg: "Staying cool! Grab something refreshing 😎" },
    { emoji: '😐', label: 'As Usual', msg: "Consistency is key! Usual order? 😄" },
    { emoji: '🙂', label: 'Nothing Different', msg: "A good meal might change that 🍱" },
    { emoji: '😴', label: 'Tired', msg: "You deserve a break and a hot meal 💪" }
  ]

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>
          <span style={{ fontSize: '2rem' }}>🍽️</span>
          <h1 style={s.logoText}>CanteenGo</h1>
        </div>
        <a href="/login" style={{ background: '#2D3436', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 600, textDecoration: 'none' }}>Manager Login</a>
      </nav>

      <section style={s.hero}>
        <h1 style={s.heroH1}>Delicious Food,<br/>Just a Tap Away</h1>
        <p style={s.heroP}>Order from your table, track live, and enjoy quick pickup</p>
        <a href="/menu"><button style={s.cta}>Order Now</button></a>
      </section>

      <section style={s.features}>
        {[
          { icon: '📱', title: 'Order from your table', desc: 'Scan QR and order instantly' },
          { icon: '📊', title: 'Live order tracking', desc: 'Know exactly when it&apos;s ready' },
          { icon: '⚡', title: 'Quick pickup', desc: 'Skip the queue, grab and go' }
        ].map((f, i) => (
          <div key={i} style={s.featureCard}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ margin: '0 0 8px' }}>{f.title}</h3>
            <p style={{ color: '#636E72', margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {banners.length > 0 && (
        <section style={{ padding: '0 40px 40px' }}>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 220, backgroundImage: `url(${banners[currentBanner]?.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, color: 'white' }}>
              <h2 style={{ margin: '0 0 4px' }}>{banners[currentBanner]?.title}</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>{banners[currentBanner]?.description}</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 12 }}>
            {banners.map((_, i) => (
              <span key={i} onClick={() => setCurrentBanner(i)} style={{ width: 10, height: 10, borderRadius: '50%', background: i === currentBanner ? '#FF6B35' : '#B2BEC3', cursor: 'pointer' }} />
            ))}
          </div>
        </section>
      )}

      <footer style={s.footer}>
        <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px' }}>CanteenGo</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>Your campus food solution</p>
      </footer>

      {showMood && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 40, maxWidth: 400, width: '90%', textAlign: 'center', animation: 'popIn 0.3s ease-out' }}>
            <button onClick={() => setShowMood(false)} style={{ float: 'right', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>✕</button>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px' }}>Hey! How&apos;s your day going? 😊</h2>
            <p style={{ color: '#636E72', marginBottom: 24 }}>Tell us your vibe today</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {moods.map((m, i) => (
                <button key={i} onClick={() => handleMood(m.msg)} style={{ background: '#f8f9fa', padding: 16, borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                  <div>{m.emoji}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500, marginTop: 4 }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {moodToast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#2D3436', color: 'white', padding: '16px 24px', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)', zIndex: 1000 }}>{moodToast}</div>}
    </div>
  )
}
