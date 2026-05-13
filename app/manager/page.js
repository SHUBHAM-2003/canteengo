'use client'
import { useState, useEffect } from 'react'

export default function ManagerDashboard() {
  const [page, setPage] = useState('overview')
  const [menuTab, setMenuTab] = useState('items')
  const [stats, setStats] = useState({})
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [banners, setBanners] = useState([])
  const [tables, setTables] = useState([])
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const nav = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'menu', label: 'Menu', icon: '🍽️' },
    { id: 'tables', label: 'Tables & QR', icon: '🪑' },
    { id: 'banners', label: 'Banners', icon: '🏷️' },
    { id: 'accounts', label: 'Accounts', icon: '👤' },
  ]

  useEffect(() => {
    if (page === 'overview') fetch('/api/stats').then(r => r.json()).then(setStats)
    else if (page === 'orders') fetch('/api/orders').then(r => r.json()).then(setOrders)
    else if (page === 'menu') { fetch('/api/menu').then(r => r.json()).then(setMenuItems) }
    else if (page === 'tables') fetch('/api/tables').then(r => r.json()).then(setTables)
    else if (page === 'banners') fetch('/api/banners').then(r => r.json()).then(setBanners)
    else if (page === 'accounts') fetch('/api/accounts').then(r => r.json()).then(setUsers)
  }, [page])

  const toggleMenuItem = async (item) => {
    await fetch('/api/menu', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, is_available: !item.is_available }) })
    fetch('/api/menu').then(r => r.json()).then(setMenuItems)
  }

  const deleteMenuItem = async (id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return
    await fetch(`/api/menu?id=${id}`, { method: 'DELETE' })
    fetch('/api/menu').then(r => r.json()).then(setMenuItems)
  }

  const saveItem = async (item) => {
    const url = editItem ? '/api/menu' : '/api/menu'
    await fetch(url, { method: editItem ? 'POST' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem ? { ...editItem, ...item } : item) })
    setShowModal(null); setEditItem(null)
    fetch('/api/menu').then(r => r.json()).then(setMenuItems)
  }

  const saveBanner = async (banner) => {
    await fetch('/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(banner) })
    setShowModal(null)
    fetch('/api/banners').then(r => r.json()).then(setBanners)
  }

  const toggleBanner = async (banner) => {
    await fetch('/api/banners', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: banner.id, is_active: !banner.is_active }) })
    fetch('/api/banners').then(r => r.json()).then(setBanners)
  }

  const createUser = async (u) => {
    await fetch('/api/accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u) })
    setShowModal(null)
    fetch('/api/accounts').then(r => r.json()).then(setUsers)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#2D3436', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '2rem' }}>🍽️</span>
          <h2 style={{ color: '#FF6B35', margin: 0 }}>CanteenGo</h2>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 16px', borderRadius: 12, background: page === n.id ? '#FF6B35' : 'transparent', color: page === n.id ? 'white' : '#B2BEC3', border: 'none', cursor: 'pointer', fontWeight: 500, marginBottom: 6, fontSize: 14 }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="/login" style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', padding: 14, borderRadius: 12, border: 'none', fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>🚪 Logout</a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 260, padding: '28px 32px', background: '#f8f9fa', minHeight: '100vh' }}>
        {page === 'overview' && (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 24px' }}>Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
              {[
                { icon: '💰', label: 'Today&apos;s Revenue', value: `₹${stats.todayRevenue || 0}` },
                { icon: '📋', label: 'Total Orders', value: stats.todayOrders || 0 },
                { icon: '📊', label: 'Avg Order Value', value: `₹${Math.round(stats.avgOrderValue || 0)}` },
                { icon: '⏳', label: 'Pending Orders', value: stats.pendingOrders || 0 },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', padding: 24, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: 14, color: '#636E72', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 16px' }}>Recent Orders</h3>
              {(stats.recentOrders || []).map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e8e8e8', fontSize: 14 }}>
                  <span style={{ fontWeight: 600 }}>#{order.order_number}</span>
                  <span>{order.table_number || 'Walk-in'}</span>
                  <span>₹{order.total_amount}</span>
                  <span style={{ padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600, background: order.order_status === 'placed' ? 'rgba(9,132,227,0.1)' : order.order_status === 'preparing' ? 'rgba(253,203,110,0.2)' : 'rgba(0,184,148,0.1)', color: order.order_status === 'placed' ? '#0984E3' : order.order_status === 'preparing' ? '#E17055' : '#00B894' }}>{order.order_status}</span>
                  <span style={{ color: '#636E72' }}>{new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'orders' && (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 24px' }}>Orders</h1>
            <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72', textTransform: 'uppercase' }}>Order#</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72', textTransform: 'uppercase' }}>Table</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72', textTransform: 'uppercase' }}>Items</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72', textTransform: 'uppercase' }}>Total</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72', textTransform: 'uppercase' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #e8e8e8', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                      <td style={{ padding: '14px 20px', fontWeight: 600 }}>#{order.order_number}</td>
                      <td style={{ padding: '14px 20px' }}>{order.table_number || '-'}</td>
                      <td style={{ padding: '14px 20px' }}>{order.items?.length || 0}</td>
                      <td style={{ padding: '14px 20px' }}>₹{order.total_amount}</td>
                      <td style={{ padding: '14px 20px' }}><span style={{ padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600, background: order.order_status === 'placed' ? 'rgba(9,132,227,0.1)' : order.order_status === 'preparing' ? 'rgba(253,203,110,0.2)' : order.order_status === 'ready' ? 'rgba(0,184,148,0.1)' : 'rgba(45,52,54,0.1)', color: order.order_status === 'placed' ? '#0984E3' : order.order_status === 'preparing' ? '#E17055' : order.order_status === 'ready' ? '#00B894' : '#636E72' }}>{order.order_status}</span></td>
                      <td style={{ padding: '14px 20px', color: '#636E72' }}>{new Date(order.created_at).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {page === 'menu' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <button onClick={() => setMenuTab('items')} style={{ padding: '12px 24px', background: menuTab === 'items' ? '#FF6B35' : 'white', color: menuTab === 'items' ? 'white' : '#2D3436', borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer', marginRight: 8 }}>All Items</button>
              <button onClick={() => setMenuTab('categories')} style={{ padding: '12px 24px', background: menuTab === 'categories' ? '#FF6B35' : 'white', color: menuTab === 'categories' ? 'white' : '#2D3436', borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Categories</button>
            </div>

            {menuTab === 'items' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Menu Items</h1>
                  <button onClick={() => setShowModal('menu')} style={{ background: '#FF6B35', color: 'white', padding: '12px 20px', borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Add Item</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                  {menuItems.map(item => (
                    <div key={item.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                        <img src={item.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: 8, right: 8, padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: item.is_available ? '#00B894' : '#B2BEC3', color: 'white' }}>{item.is_available ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div style={{ padding: 16 }}>
                        <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{item.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: '#FF6B35' }}>₹{item.price}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button onClick={() => { setEditItem(item); setShowModal('menu') }} style={{ padding: '8px 14px', borderRadius: 8, background: '#f8f9fa', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Edit</button>
                          <button onClick={() => toggleMenuItem(item)} style={{ padding: '8px 14px', borderRadius: 8, background: item.is_available ? 'rgba(253,203,110,0.2)' : 'rgba(0,184,148,0.1)', color: item.is_available ? '#E17055' : '#00B894', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>{item.is_available ? 'Deactivate' : 'Activate'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {menuTab === 'categories' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
                {['Meals', 'Snacks', 'Drinks', 'Beverages'].map(cat => (
                  <div key={cat} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ margin: 0 }}>{cat}</h3>
                    <div style={{ color: '#636E72', fontSize: 14, marginTop: 8 }}>Category</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {page === 'tables' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Tables & QR</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {tables.map(table => (
                <div key={table.id} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>Table {table.table_number}</span>
                    <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: table.is_active ? '#00B894' : '#B2BEC3', color: 'white' }}>{table.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div style={{ background: '#f8f9fa', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 24, color: '#B2BEC3', marginBottom: 12 }}>
                    📱 QR Code
                  </div>
                  <div style={{ fontSize: 12, color: '#636E72' }}>/menu?table={table.table_number}</div>
                  <div style={{ fontSize: 11, color: '#B2BEC3', marginTop: 8 }}>Last scanned: {table.last_scanned_at ? new Date(table.last_scanned_at).toLocaleDateString() : 'Never'}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'banners' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Banner Offers</h1>
              <button onClick={() => { setEditItem(null); setShowModal('banner') }} style={{ background: '#FF6B35', color: 'white', padding: '12px 20px', borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ New Banner</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
              {banners.map(banner => (
                <div key={banner.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div style={{ height: 150, overflow: 'hidden', position: 'relative' }}>
                    <img src={banner.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop'} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 8, right: 8, padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: banner.is_active ? '#00B894' : '#B2BEC3', color: 'white' }}>{banner.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{banner.title}</h3>
                    <p style={{ margin: 0, color: '#636E72', fontSize: 13 }}>{banner.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#636E72', marginTop: 12 }}>
                      <span>Clicks: {banner.click_count}</span>
                      <span>Valid: {banner.valid_till}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button onClick={() => { setEditItem(banner); setShowModal('banner') }} style={{ padding: '8px 14px', borderRadius: 8, background: '#f8f9fa', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Edit</button>
                      <button onClick={() => toggleBanner(banner)} style={{ padding: '8px 14px', borderRadius: 8, background: banner.is_active ? 'rgba(253,203,110,0.2)' : 'rgba(0,184,148,0.1)', color: banner.is_active ? '#E17055' : '#00B894', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>{banner.is_active ? 'Deactivate' : 'Activate'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'accounts' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Accounts</h1>
              <button onClick={() => setShowModal('user')} style={{ background: '#FF6B35', color: 'white', padding: '12px 20px', borderRadius: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Create Account</button>
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72' }}>Name</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72' }}>Email</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#636E72' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                      <td style={{ padding: '14px 20px' }}>{u.name}</td>
                      <td style={{ padding: '14px 20px', color: '#636E72' }}>{u.email}</td>
                      <td style={{ padding: '14px 20px' }}><span style={{ padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600, background: u.role === 'manager' ? 'rgba(255,107,53,0.1)' : 'rgba(9,132,227,0.1)', color: u.role === 'manager' ? '#FF6B35' : '#0984E3' }}>{u.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelectedOrder(null)}>
            <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Order #{selectedOrder.order_number}</h2>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8e8e8' }}><span style={{ color: '#636E72' }}>Table:</span><span>{selectedOrder.table_number || 'Walk-in'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8e8e8' }}><span style={{ color: '#636E72' }}>Payment:</span><span>{selectedOrder.payment_mode}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8e8e8' }}><span style={{ color: '#636E72' }}>Status:</span><span style={{ padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600, background: selectedOrder.order_status === 'placed' ? 'rgba(9,132,227,0.1)' : selectedOrder.order_status === 'preparing' ? 'rgba(253,203,110,0.2)' : 'rgba(0,184,148,0.1)', color: selectedOrder.order_status === 'placed' ? '#0984E3' : selectedOrder.order_status === 'preparing' ? '#E17055' : '#00B894' }}>{selectedOrder.order_status}</span></div>
                <h4 style={{ margin: '16px 0 12px' }}>Items</h4>
                <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 12 }}>
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>{item.name} × {item.quantity}</span><span>₹{Number(item.price) * item.quantity}</span></div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, fontWeight: 700, fontSize: 18, color: '#FF6B35' }}><span>Total</span><span>₹{selectedOrder.total_amount}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Item / Add Banner / Add User */}
        {showModal === 'menu' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowModal(null)}>
            <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>{editItem ? 'Edit Item' : 'Add Item'}</h2>
                <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); saveItem({ name: fd.get('name'), category: fd.get('category'), price: parseFloat(fd.get('price')), image_url: fd.get('image_url'), is_available: fd.get('is_available') === 'on' }) }} style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Name</label><input name="name" defaultValue={editItem?.name || ''} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Category</label><select name="category" defaultValue={editItem?.categories?.name || 'Meals'} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }}><option>Meals</option><option>Snacks</option><option>Drinks</option><option>Beverages</option></select></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Price (₹)</label><input name="price" type="number" step="0.01" defaultValue={editItem?.price || ''} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Image URL</label><input name="image_url" defaultValue={editItem?.image_url || ''} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 24 }}><label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}><input name="is_available" type="checkbox" defaultChecked={editItem?.is_available ?? true} style={{ width: 20, height: 20 }} /><span>Available</span></label></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setShowModal(null)} style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: '2px solid #e8e8e8', background: 'white', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: 'none', background: '#FF6B35', color: 'white', cursor: 'pointer' }}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal === 'banner' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowModal(null)}>
            <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Add Banner</h2>
                <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); saveBanner({ title: fd.get('title'), description: fd.get('description'), image_url: fd.get('image_url'), valid_till: fd.get('valid_till'), is_active: fd.get('is_active') === 'on' }) }} style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Title</label><input name="title" required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Description</label><input name="description" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Image URL</label><input name="image_url" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Valid Till</label><input name="valid_till" type="date" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 24 }}><label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}><input name="is_active" type="checkbox" defaultChecked style={{ width: 20, height: 20 }} /><span>Active</span></label></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setShowModal(null)} style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: '2px solid #e8e8e8', background: 'white', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: 'none', background: '#FF6B35', color: 'white', cursor: 'pointer' }}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal === 'user' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowModal(null)}>
            <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Create Account</h2>
                <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); createUser({ name: fd.get('name'), email: fd.get('email'), password: fd.get('password'), role: fd.get('role') }) }} style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Name</label><input name="name" required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Email</label><input name="email" type="email" required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Password</label><input name="password" type="password" required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }} /></div>
                <div style={{ marginBottom: 24 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Role</label><select name="role" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 16 }}><option value="student">Student</option><option value="manager">Manager</option></select></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setShowModal(null)} style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: '2px solid #e8e8e8', background: 'white', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 600, border: 'none', background: '#FF6B35', color: 'white', cursor: 'pointer' }}>Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
