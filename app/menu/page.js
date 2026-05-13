'use client'
import { useState, useEffect } from 'react'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [banners, setBanners] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [cart, setCart] = useState({})
  const [category, setCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMode, setPaymentMode] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)
  const tableNumber = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('table') : null

  useEffect(() => {
    Promise.all([
      fetchJSON('/api/menu'),
      fetchJSON('/api/banners')
    ]).then(([menu, b]) => {
      setMenuItems(menu || [])
      setBanners((b || []).filter(x => x.is_active))
      setLoading(false)
    }).catch((err) => {
      console.error('Failed to load:', err)
      setError('Failed to load menu. Please refresh.')
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setCurrentBanner(prev => (prev + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [banners.length])

  const cats = ['All', 'Meals', 'Snacks', 'Drinks', 'Beverages']
  const filteredItems = category === 'All' ? menuItems : menuItems.filter(item => item.categories?.name === category)

  const addItem = (item) => {
    if (!item.is_available) return
    setCart(prev => ({ ...prev, [item.id]: { ...item, qty: (prev[item.id]?.qty || 0) + 1 } }))
  }

  const updateQty = (id, delta) => {
    setCart(prev => {
      if (!prev[id]) return prev
      const newQty = (prev[id]?.qty || 0) + delta
      if (newQty <= 0) { const { [id]: _, ...rest } = prev; return rest }
      return { ...prev, [id]: { ...prev[id], qty: newQty } }
    })
  }

  const cartItems = Object.values(cart)
  const cartTotal = cartItems.reduce((sum, i) => sum + Number(i.price || 0) * i.qty, 0)

  const placeOrder = async () => {
    if (!paymentMode) return
    if (paymentMode === 'online' && !showPayment) { setShowPayment(true); return }
    setPlacing(true)
    try {
      const body = JSON.stringify({
        table_number: tableNumber ? `Table ${tableNumber}` : 'Walk-in',
        items: cartItems.map(i => ({ item_id: i.id, name: i.name, price: i.price, quantity: i.qty })),
        total_amount: cartTotal,
        payment_mode: paymentMode
      })
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      })
      const order = await res.json()
      if (!res.ok) throw new Error(order.error || 'Failed to place order')
      if (order.id) window.location.href = `/order/${order.id}`
    } catch (e) {
      alert(e.message)
      setPlacing(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, marginBottom: 12 }}>🍽️</div><div>Loading menu...</div></div>
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div><div style={{ color: '#D63031', marginBottom: 16 }}>{error}</div>
        <button onClick={() => window.location.reload()} style={{ background: '#FF6B35', color: 'white', padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Retry</button>
      </div>
    </div>
  )

  const s = {
    container: { minHeight: '100vh', background: '#f8f9fa' },
    nav: { position: 'fixed', top: 0, left: 0, right: 0, height: 64, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 100 },
    main: { marginTop: 64, padding: 20, paddingBottom: 100, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' },
    bottomBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '14px 20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }
  }

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.5rem' }}>🍽️</span>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FF6B35', margin: 0 }}>CanteenGo</h1>
          {tableNumber && <span style={{ background: '#FF6B35', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>📍 Table {tableNumber}</span>}
        </div>
        <button onClick={() => setShowCart(true)} style={{ background: '#f8f9fa', padding: 10, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', fontSize: 22 }}>
          🛒
          {cartItems.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#D63031', color: 'white', width: 20, height: 20, borderRadius: '50%', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartItems.length}</span>}
        </button>
      </nav>

      <main style={s.main}>
        {banners.length > 0 && (
          <div style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', height: 180, backgroundImage: `url(${banners[currentBanner]?.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', height: '100%', display: 'flex', alignItems: 'flex-end', padding: 16, color: 'white' }}>
              <div><h3 style={{ margin: 0 }}>{banners[currentBanner]?.title}</h3><p style={{ margin: '4px 0 0', fontSize: 14 }}>{banners[currentBanner]?.description}</p></div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '8px 0 20px' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '12px 24px', background: category === c ? '#FF6B35' : 'white', color: category === c ? 'white' : '#636E72', borderRadius: 24, fontWeight: 600, border: '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c}</button>
          ))}
        </div>

        {filteredItems.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#636E72' }}>No menu items found in this category</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {filteredItems.map(item => {
              const inCart = cart[item.id]
              return (
                <div key={item.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', opacity: item.is_available ? 1 : 0.6 }}>
                  <div style={{ height: 120, overflow: 'hidden' }}>
                    <img src={item.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: 14 }}>
                    <span style={{ display: 'inline-block', padding: '4px 10px', background: '#f8f9fa', borderRadius: 12, fontSize: 11, fontWeight: 600, color: '#636E72' }}>{item.categories?.name || ''}</span>
                    <h3 style={{ margin: '8px 0 6px', fontSize: 16, fontWeight: 600 }}>{item.name}</h3>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#FF6B35' }}>₹{item.price}</div>
                    <div style={{ marginTop: 12 }}>
                      {!item.is_available ? <span style={{ color: '#D63031', fontWeight: 600, fontSize: 13 }}>Unavailable</span> :
                        inCart ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f8f9fa', padding: 8, borderRadius: 12 }}>
                            <button onClick={() => updateQty(item.id, -1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>−</button>
                            <span style={{ fontWeight: 700, minWidth: 28, textAlign: 'center' }}>{inCart.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+</button>
                          </div>
                        ) : (
                          <button onClick={() => addItem(item)} style={{ width: '100%', background: '#FF6B35', color: 'white', padding: '10px', borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Add</button>
                        )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {cartItems.length > 0 && (
        <div style={s.bottomBar}>
          <div><span style={{ fontSize: 13, color: '#636E72' }}>{cartItems.length} items</span><br /><span style={{ fontSize: 20, fontWeight: 700, color: '#FF6B35' }}>₹{cartTotal}</span></div>
          <button onClick={() => setShowCart(true)} style={{ background: '#FF6B35', color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>View Cart</button>
        </div>
      )}

      {showCart && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} onClick={() => setShowCart(false)} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400, background: 'white', zIndex: 201, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 20, borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Your Cart</h2>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {cartItems.length === 0 ? <div style={{ textAlign: 'center', padding: 20, color: '#636E72' }}>Cart is empty</div> :
                cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #e8e8e8' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: '#636E72', fontSize: 13 }}>₹{item.price} × {item.qty}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ width: 26, height: 26, borderRadius: '50%', background: '#f8f9fa', border: 'none', cursor: 'pointer' }}>−</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ width: 26, height: 26, borderRadius: '50%', background: '#f8f9fa', border: 'none', cursor: 'pointer' }}>+</button>
                        </div>
                        <button onClick={() => { if (cart[item.id]) updateQty(item.id, -cart[item.id].qty) }} style={{ background: 'none', color: '#D63031', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div style={{ padding: 20, borderTop: '1px solid #e8e8e8', background: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ color: '#636E72' }}>Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF6B35' }}>₹{cartTotal}</span>
              </div>
              <button onClick={() => { setShowCart(false); setShowCheckout(true) }} disabled={cartItems.length === 0} style={{ width: '100%', background: '#FF6B35', color: 'white', padding: 16, borderRadius: 12, fontWeight: 600, border: 'none', cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer', opacity: cartItems.length === 0 ? 0.5 : 1 }}>Place Order</button>
            </div>
          </div>
        </>
      )}

      {showCheckout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowCheckout(false)}>
          <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Checkout</h2>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e8e8e8', fontSize: 14 }}>
                    <span>{item.name} × {item.qty}</span><span>₹{Number(item.price) * item.qty}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 700, fontSize: 18, color: '#FF6B35' }}><span>Total</span><span>₹{cartTotal}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <button onClick={() => { setPaymentMode('counter'); setShowPayment(false) }} style={{ flex: 1, padding: 16, border: `2px solid ${paymentMode === 'counter' ? '#FF6B35' : '#e8e8e8'}`, borderRadius: 12, background: paymentMode === 'counter' ? 'rgba(255,107,53,0.08)' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>💵</div>
                  <h4 style={{ margin: '8px 0 4px', fontSize: 14 }}>Pay at Counter</h4>
                  <p style={{ margin: 0, fontSize: 12, color: '#636E72' }}>Pay when you pick up</p>
                </button>
                <button onClick={() => setPaymentMode('online')} style={{ flex: 1, padding: 16, border: `2px solid ${paymentMode === 'online' ? '#FF6B35' : '#e8e8e8'}`, borderRadius: 12, background: paymentMode === 'online' ? 'rgba(255,107,53,0.08)' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>💳</div>
                  <h4 style={{ margin: '8px 0 4px', fontSize: 14 }}>Pay Online</h4>
                  <p style={{ margin: 0, fontSize: 12, color: '#636E72' }}>Pay now via UPI/Card</p>
                </button>
              </div>
              {paymentMode === 'online' && !showPayment && (
                <button onClick={() => setShowPayment(true)} style={{ width: '100%', padding: 14, background: '#f8f9fa', border: '2px dashed #e8e8e8', borderRadius: 12, color: '#FF6B35', fontWeight: 600, cursor: 'pointer' }}>Enter Payment Details →</button>
              )}
              {showPayment && paymentMode === 'online' && (
                <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 12 }}>
                  <input placeholder="UPI ID / Card Number" style={{ width: '100%', padding: 12, border: '2px solid #e8e8e8', borderRadius: 8, marginBottom: 12 }} />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <input placeholder="Expiry (MM/YY)" style={{ width: '50%', padding: 12, border: '2px solid #e8e8e8', borderRadius: 8 }} />
                    <input placeholder="CVV" style={{ width: '50%', padding: 12, border: '2px solid #e8e8e8', borderRadius: 8 }} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '20px 24px', borderTop: '1px solid #e8e8e8', display: 'flex', gap: 12 }}>
              <button onClick={() => setShowCheckout(false)} style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: '2px solid #e8e8e8', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={placeOrder} disabled={!paymentMode || (paymentMode === 'online' && !showPayment) || placing} style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: 'none', background: (!paymentMode || (paymentMode === 'online' && !showPayment) || placing) ? '#B2BEC3' : '#FF6B35', color: 'white', cursor: (!paymentMode || (paymentMode === 'online' && !showPayment) || placing) ? 'not-allowed' : 'pointer' }}>{placing ? 'Placing...' : 'Confirm Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
