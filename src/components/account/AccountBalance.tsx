import React, { useEffect, useState } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

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
            const connection = new Connection(clusterApiUrl('devnet')) // ou ENDPOINT importé
            const pubkey = new PublicKey(address)

            connection.getBalance(pubkey)
              .then(lamports => {
                  if (mounted) setBalance(lamports / 1e9)
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
