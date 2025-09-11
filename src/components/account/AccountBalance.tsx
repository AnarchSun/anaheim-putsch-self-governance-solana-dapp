// PATH: src/components/account/AccountBalance.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: dynamic Solana balance display using fetchBalance, ready for all punk accounts, matrix override!

import React, { useEffect, useState } from 'react'
import { fetchBalance } from './address' // PATCH: Import your fixed function!

type Props = {
    address: string
}

export const AccountBalance: React.FC<Props> = ({ address }) => {
    const [balance, setBalance] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        setError(null)
        setBalance(null)
        if (address) {
            fetchBalance(address)
                .then((result) => {
                    if (mounted) setBalance(result.lamports / 1e9)
                })
                .catch((e) => {
                    if (mounted) setError(e?.message || 'Erreur inconnue')
                })
                .finally(() => {
                    if (mounted) setLoading(false)
                })
        } else {
            setError('Adresse non fournie')
            setLoading(false)
        }
        return () => { mounted = false }
    }, [address])

    return (
        <div>
            <div>Solana Balance for: {address}</div>
            {loading && <div className="text-muted">Chargement du solde…</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && balance !== null && (
                <div className="font-bold">{balance.toFixed(4)} SOL</div>
            )}
        </div>
    )
}

// PATCH NOTES:
// - Solana balance fetched and displayed live using fetchBalance
// - Handles loading/error states
// - Ready for import and use in account/page/dashboard
// - Filename/path toujours, matrix override!