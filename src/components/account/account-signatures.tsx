// PATH: src/components/account/account-signatures.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Imports endpoint from config, never hardcode, matrix override, filename/path éternel!

'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection'
import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js'
import { SOLANA_CLUSTER_URL } from '@/config/solana' // <-- PATCH: Import endpoint!

interface AccountSignaturesProps {
    address: string
}

export default function AccountSignatures({ address }: AccountSignaturesProps) {
    // PATCH: Memoize publicKey from address string
    const publicKey = useMemo(() => new PublicKey(address), [address])
    // PATCH: Use imported endpoint, NEVER hardcode!
    const wrappedConnection = useWrappedConnection(SOLANA_CLUSTER_URL, address, publicKey)

    const [signatures, setSignatures] = useState<ConfirmedSignatureInfo[] | null>(null)

    useEffect(() => {
        if (!wrappedConnection?.connection) return

        wrappedConnection.connection
            .getSignaturesForAddress(publicKey, { limit: 100 })
            .then((signatures: ConfirmedSignatureInfo[]) => {
                setSignatures(signatures)
                console.log('Signatures capturées dans la toile astrale:', signatures)
            })
            .catch(console.error)
    }, [wrappedConnection, publicKey])

    return (
        <div>
            <h3>Signatures pour {address}</h3>
            {signatures ? (
                <ul>
                    {signatures.map(({ signature, slot }, i) => (
                        <li key={i}>
                            Signature: {signature} — Slot: {slot}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Chargement des traces...</p>
            )}
        </div>
    )
}

// PATCH NOTES:
// - Imports endpoint from config, never hardcode in punk dapp!
// - Matrix override, filename/path éternel, batch fix grunge
// - Zéro mirage, tout est révélé, reality hacked!