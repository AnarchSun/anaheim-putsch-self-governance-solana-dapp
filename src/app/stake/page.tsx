'use client'

import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { StakeWatcher } from '@/components/stake/StakeWatcher'
import { DebugStakeStatus } from '@/hooks/stake/debugStakeStatus'
import { fetchStakeState } from '@/lib/stake/stakeHelpers'

const STAKE_ACCOUNT = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')

export default function StakePage() {
    const [state, setState] = useState<string | null>(null)

    useEffect(() => {
        void (async () => {
            const stakeState = await fetchStakeState(STAKE_ACCOUNT)
            setState(stakeState)
        })()
    }, [])

    return (
        <main className="p-4">
            <h1 className="text-xl font-bold">Stake Page</h1>

            <div>
                <h2>Statut du Stake</h2>
                <p>État : {state ?? 'Inconnu'}</p>
                <p>Actif : {state === 'active' ? 'Oui' : 'Non'}</p>
                <p>Inactif : {state === 'inactive' ? 'Oui' : 'Non'}</p>
            </div>

            <div>
                <h2>État du stake : {state ?? 'chargement...'}</h2>
                <StakeWatcher address="8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX" />
            </div>

            <h2 className="mt-4 font-semibold">Debug Stake</h2>
            <DebugStakeStatus />
        </main>
    )
}
