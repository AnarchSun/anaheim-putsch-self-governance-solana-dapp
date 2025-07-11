// src/app/mining/page.tsx
'use client'

import React, { useState } from 'react'
import MiningPanel from '@/components/mining/mining-panel'
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui'
import { MiningContext } from '@/contexts/MiningContext'

export default function MiningPage() {
    const [state, setState] = useState(null)

    return (
        <MiningContext.Provider value={{ state, setState }}>
            <main className="space-y-4 p-8">
                <h1 className="text-xl font-bold">Mining Page</h1>
                <WalletConnectButton />
                <MiningPanel />
            </main>
        </MiningContext.Provider>
    )
}
