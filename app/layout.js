export const metadata = {
  title: 'CanteenGo - College Canteen Ordering',
  description: 'Order from your table with live tracking',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', sans-serif", background: '#f8f9fa', color: '#2d3436' }}>
        {children}
      </body>
    </html>
  )
}
