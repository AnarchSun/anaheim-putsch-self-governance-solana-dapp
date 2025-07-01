// src/components/account/account-signatures.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection'
import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js'
import { connection } from 'next/server'

interface AccountSignaturesProps {
  address: string
}

export default function AccountSignatures({ address }: AccountSignaturesProps) {
  const publicKey = useMemo(() => new PublicKey(address), [address])
  const wrappedConnection = useWrappedConnection('https://api.devnet.solana.com', address, publicKey, connection)

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
