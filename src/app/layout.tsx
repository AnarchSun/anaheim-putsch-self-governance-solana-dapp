// src/app/layout.tsx
'use client'

import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
    <body className="h-full bg-black text-white">{children}
    <header style={{ padding: 16, borderBottom: '1px solid white' }}>
      <h1>Header visible</h1>
    </header>
    <main style={{ padding: 16 }}>
      {children}
    </main>
    </body>
    </html>
  )
}

