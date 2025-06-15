import { useEffect, useMemo } from 'react'
import { useSolanaClient } from '@/hooks/solana/useSolanaClient'
import { PublicKey } from '@solana/web3.js'

export function StakeWatcher({ address }: { address: string }) {
  const client = useSolanaClient()

  const pubkey = useMemo(() => new PublicKey(address), [address])

  useEffect(() => {
    const id = client.onAccountChange(pubkey, (info) => {
      console.log('Stake changed:', info)
    })

    return () => {
      client.removeAccountChangeListener(id).catch(console.error)
    }
  }, [client, pubkey]) // maintenant `pubkey` est stable

  return null
}
