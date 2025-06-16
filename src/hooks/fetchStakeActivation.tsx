// src/hooks/fetchStakeActivation.tsx
import { useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { publicKey } from '@solana/web3.js/src/layout'

useEffect(() => {
  fetchStakeActivation ( publicKey() )
}, [])
export function fetchStakeActivation(pubkey: PublicKey) {
  throw new Error('Function not implemented.')
}
