// src/hooks/solana/useStakingDemo.ts
import { useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { fetchStakeInfo } from '@/lib/solana/fetchStakeInfo'

export default function useStakingDemo(publicKey: PublicKey) {
  useEffect(() => {
    if (!publicKey) return
    fetchStakeInfo(publicKey)
      .then(({ activation, minDelegation, votes }) => {
        console.log('Stake Activation:', activation)
        console.log('Min Delegation:', minDelegation)
        console.log('Vote Accounts:', votes)
      })
      .catch(console.error)
  }, [publicKey])
}
