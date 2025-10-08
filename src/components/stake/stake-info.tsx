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
        // FIX: getAccountInfo expects a PublicKey, not an object!
        const accountInfo = await connection.getAccountInfo(pubkey)
        if (!accountInfo) {
          setStakeAccount(null)
          return
        }

        // NOTE: You must decode the accountInfo.data here to get real values.
        // For now, use placeholder values. In a real app, decode buffer accordingly.
        const activationEpoch = 123 // TODO: decode from accountInfo.data
        const delegatedStake = 456 // TODO: decode from accountInfo.data

        setStakeAccount({ activationEpoch, delegatedStake })
      } catch (error) {
        console.error('Erreur fetchStakeAccount', error)
        setStakeAccount(null)
      }
    }

    fetchStakeAccount().then(() =>{} )
  }, [stakeAddress, connection])

  if (!stakeAccount) {
    return (
        <div>
          No stake account data available for <code>{stakeAddress}</code>
        </div>
    )
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