// PATH: src/components/account/account-signatures.tsx

'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection'
import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js'
import { SOLANA_CLUSTER_URL } from '@/config/solana'

interface AccountSignaturesProps {
  address: string
}

export default function AccountSignatures({ address }: AccountSignaturesProps) {
  const publicKey = useMemo(() => new PublicKey(address), [address])
  // Correction : n'utiliser qu'un seul argument
  const wrappedConnection = useWrappedConnection(SOLANA_CLUSTER_URL)

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
