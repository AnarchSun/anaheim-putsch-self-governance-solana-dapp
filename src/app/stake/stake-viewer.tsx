// src/components/stake/stake-viewer.tsx
import React, { useEffect, useState } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { Stake, Meta } from '@/../../vendor/solana-rpc-client-extensions/js/src/stake'; // à fixer

interface StakeAccount {
  activationEpoch: number
  delegatedStake: number
  discriminant: number
  meta: Meta
  stake: Stake
}

interface StakeViewerProps {
  pubkey: PublicKey
}

export function StakeViewer({ pubkey }: StakeViewerProps) {
  const [stakeAccount, setStakeAccount] = useState<StakeAccount | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!pubkey) return

    const connection = new Connection(clusterApiUrl('devnet'))

    async function fetchStakeAccount() {
      try {
        const accountInfo = await connection.getAccountInfo(pubkey)
        if (!accountInfo) {
          setStakeAccount(null)
          setError('No account info found')
          return
        }

        setStakeAccount(stakeAccount)

        setError(null)
      } catch (err) {
        console.error('Error fetching stake account:', err)
        setError('Erreur lors de la récupération du stake account')
        setStakeAccount(null)
      }
    }

    fetchStakeAccount().catch(e => {
      console.error('Unhandled fetch error:', e)
      setError('Erreur inconnue lors de la récupération')
    })

    // Pas de return ici ou return undefined / void
  },  [pubkey, stakeAccount])

  if (error) return <p>{error}</p>

  if (!stakeAccount) return <p>Loading stake info...</p>

  return (
    <div>
      <p>Activation Epoch: {stakeAccount.activationEpoch}</p>
      <p>Delegated Stake: {stakeAccount.delegatedStake}</p>
    </div>
  )
}
