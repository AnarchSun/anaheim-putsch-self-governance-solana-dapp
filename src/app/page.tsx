// FILE: src/app/page.tsx
'use client'

import { DashboardFeature } from '@/components/dashboard/dashboard-feature'

// FIX: Pure ESM, only export default for page function. No CommonJS syntax (no module.exports, no exports.*).
export default function Home() {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="content-box">
                <DashboardFeature />
            </div>
        </div>
    )
}