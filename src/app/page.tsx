// FILE: src/app/page.tsx
'use client'

import { DashboardFeature } from '@/components/dashboard/dashboard-feature'

export default function Home() {
    return (
        // We wrap the homepage feature in our consistent layout container.
        <div className="w-full max-w-5xl mx-auto">
            <div className="content-box">
                <DashboardFeature />
            </div>
        </div>
    )
}