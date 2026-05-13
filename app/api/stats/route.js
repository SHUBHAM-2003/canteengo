import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'

const db = () => getServiceClient()

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: todayOrders } = await db().from('orders').select('*').gte('created_at', today)
    const { data: pendingOrders } = await db().from('orders').select('*').in('order_status', ['placed', 'preparing'])
    const { data: menuItems } = await db().from('menu_items').select('*').eq('is_available', false)
    
    const orders = todayOrders || []
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    
    return NextResponse.json({
      todayOrders: orders.length,
      todayRevenue: totalRevenue,
      pendingOrders: pendingOrders?.length || 0,
      unavailableItems: menuItems?.length || 0,
      avgOrderValue,
      recentOrders: orders.slice(-10).reverse()
    })
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}
