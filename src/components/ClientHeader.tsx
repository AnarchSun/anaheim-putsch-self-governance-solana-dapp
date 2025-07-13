// src/components/ClientHeader.tsx
'use client'

import { usePathname } from 'next/navigation'

export default function ClientHeader() {
    const pathname = usePathname()
    if (pathname === '/') return null
    return (
        <header style={{ padding: 16, borderBottom: '1px solid white' }}>
            <h1>Header visible</h1>
        </header>
    )
}
