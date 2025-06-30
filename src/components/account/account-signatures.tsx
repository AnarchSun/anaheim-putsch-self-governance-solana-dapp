// src/components/account/account-signatures.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection'
import { PublicKey, ConfirmedSignatureInfo } from '@solana/web3.js'

export function AccountSignatures({ address }: { address: string }) {
  const rpcUrl = 'https://api.devnet.solana.com' // Miroir lumineux de la connexion
  const wrappedConnection = useWrappedConnection ( rpcUrl, _address, unknown, any ) // { rpcUrl, connection }
  const publicKey = useMemo(() => new PublicKey(address), [address])

  const [signatures, setSignatures] = useState<ConfirmedSignatureInfo[] | null>(null)

  useEffect(() => {
    wrappedConnection.connection.getSignaturesForAddress(publicKey, { limit: 100 })
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
