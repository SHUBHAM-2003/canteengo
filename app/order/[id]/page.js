'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function OrderStatusPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/orders/${id}`).then(r => r.json()).then(setOrder).catch(() => {})
    const interval = setInterval(() => {
      fetch(`/api/orders/${id}`).then(r => r.json()).then(setOrder).catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [id])

  if (!order) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>

  const steps = ['placed', 'preparing', 'ready', 'completed']
  const currentIndex = steps.indexOf(order.order_status) + 1

  const messages = {
    placed: "Your order is received. Hang tight!",
    preparing: "Chef is working on your order!",
    ready: `Your order is ready! Come pick it up. Order #${order.order_number}`,
    completed: "Order completed. Thank you!"
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'linear-gradient(135deg, #2D3436 0%, #1a1a2e 100%)' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '40px 32px', maxWidth: 440, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.16)', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: 700, color: '#FF6B35', marginBottom: 8 }}>#{order.order_number}</div>
        <div style={{ background: '#FF6B35', color: 'white', padding: '10px 24px', borderRadius: 24, display: 'inline-block', fontWeight: 600, marginBottom: 28 }}>{order.table_number || 'Walk-in'}</div>

        <div style={{ textAlign: 'left', padding: '0 8px', marginBottom: 28 }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e8e8e8', fontSize: 14 }}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{Number(item.price) * item.quantity}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, fontWeight: 700, fontSize: 18, color: '#FF6B35' }}><span>Total</span><span>₹{order.total_amount}</span></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '32px 0 28px', position: 'relative', padding: '0 10px' }}>
          {['Placed', 'Preparing', 'Ready', 'Done'].map((step, i) => (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: i < currentIndex ? '#00B894' : i === currentIndex ? '#FF6B35' : 'white', border: `3px solid ${i < currentIndex ? '#00B894' : i === currentIndex ? '#FF6B35' : '#e8e8e8'}`, color: i <= currentIndex ? 'white' : '#B2BEC3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{i < currentIndex ? '✓' : i + 1}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: i <= currentIndex ? '#2D3436' : '#B2BEC3' }}>{step}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: 20, background: '#f8f9fa', borderRadius: 12, marginBottom: 24, fontWeight: 500, color: '#636E72' }}>
          {messages[order.order_status] || ''}
        </div>

        <a href="/menu" style={{ display: 'block', width: '100%', background: '#FF6B35', color: 'white', padding: 16, borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>Back to Menu</a>
      </div>
    </div>
  )
}
