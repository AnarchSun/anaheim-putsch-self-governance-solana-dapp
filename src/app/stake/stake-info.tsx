import React, { useEffect, useState } from 'react'
import { PublicKey, Connection } from '@solana/web3.js'

interface StakeAccount {
  activationEpoch: number
  delegatedStake: number
}

interface StakeInfoProps {
  stakeAddress: string
  connection: Connection
}

export function StakeInfo({ stakeAddress, connection }: StakeInfoProps) {
  const [stakeAccount, setStakeAccount] = useState<StakeAccount | null>(null)

  useEffect(() => {
    async function fetchStakeAccount() {
      try {
        const pubkey = new PublicKey(stakeAddress)
        const accountInfo = await connection.getAccountInfo(pubkey)
        if (!accountInfo) {
          setStakeAccount(null)
          return
        }
        // Ici, adapte selon le décodage réel des données du compte Stake
        // Exemple fictif pour l’instant :
        const activationEpoch = 123
        const delegatedStake = 456

        setStakeAccount({ activationEpoch, delegatedStake })
      } catch (error) {
        console.error('Erreur fetchStakeAccount', error)
        setStakeAccount(null)
      }
    }

    // Appel du fetch sans imbriquer un autre useEffect
    fetchStakeAccount()
  }, [stakeAddress, connection])

  if (!stakeAccount) {
    return <div>No stake account data available for <code>{stakeAddress}</code></div>
  }

  const { activationEpoch, delegatedStake } = stakeAccount

  return (
    <div>
      Stake info in console for <code>{stakeAddress}</code>
      <h3>Stake Details</h3>
      <p>Delegated Stake: {delegatedStake}</p>
      <p>Activation Epoch: {activationEpoch}</p>
    </div>
  )
}
