// File: src/components/stake/stake-viewer.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Meta, Stake } from '@solana-program/stake'

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
    const connection = new Connection('https://api.mainnet-beta.solana.com')

    async function fetchStakeAccount() {
      try {
        const accountInfo = await connection.getParsedAccountInfo(pubkey)
        if (!accountInfo.value) {
          setStakeAccount(null)
          setError('Aucune information de compte trouvée.')
          return
        }

        const data = accountInfo.value.data
        if (typeof data !== 'object' || !('parsed' in data)) {
          throw new Error('Format de compte inattendu')
        }

        const parsed = (data as any).parsed
        const info = parsed?.info
        if (!info || !info.stake) {
          throw new Error('Aucune info stake')
        }

        setStakeAccount({
          activationEpoch: info.stake.activationEpoch,
          delegatedStake: info.stake.delegatedStake,
          discriminant: 0,
          meta: info.meta,
          stake: info.stake,
        })

        setError(null)
      } catch (err) {
        console.error('Erreur lors de la récupération du compte de stake:', err)
        setError('Erreur lors de la récupération du compte de stake')
      }
    }

    fetchStakeAccount()
  }, [pubkey])

  if (error) return <p>{error}</p>
  if (!stakeAccount) return <p>Chargement du compte de stake...</p>

  return (
      <div>
        <p>Activation Epoch: {stakeAccount.activationEpoch}</p>
        <p>Delegated Stake: {stakeAccount.delegatedStake}</p>
      </div>
  )
}
