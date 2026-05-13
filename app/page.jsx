import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">CanteenGo</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">Welcome to CanteenGo</h2>
          <p className="text-lg text-gray-700 mb-8">College Canteen Ordering System</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Order from Your Table</h3>
              <p className="text-gray-600">Scan the QR code to order from your table</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Live Order Tracking</h3>
              <p className="text-gray-600">Track your order status in real-time</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Quick Counter Pickup</h3>
              <p className="text-gray-600">Get your food fast with no waiting</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}