import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  
  const { data: todayOrders } = await supabase.from('orders').select('*').gte('created_at', today)
  const { data: pendingOrders } = await supabase.from('orders').select('*').in('order_status', ['placed', 'preparing'])
  const { data: menuItems } = await supabase.from('menu_items').select('*').eq('is_available', false)
  
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
}
