// src/components/stake/StakeWatcher.tsx
import React from 'react'
import { PublicKey } from '@solana/web3.js'
import { useConnection } from '@solana/wallet-adapter-react'
import { useStakeActivationStatus } from '@/hooks/stake/useStakeActivationStatus'

export interface StakeWatcherProps {
  address: string
}

export function StakeWatcher({ address }: StakeWatcherProps) {
  const { connection } = useConnection()
  const pubkey = React.useMemo(() => new PublicKey(address), [address])
  const stakeActivationStatus = useStakeActivationStatus(pubkey, connection)

    if (stakeActivationStatus.loading) return <p>🔄 Chargement...</p>
  if (stakeActivationStatus.error) return <p>⚠️ Erreur : {stakeActivationStatus.error.message}</p>

  return (
    <div>
      État du stake : <strong>{stakeActivationStatus.state ?? 'inconnu'}</strong>
    </div>
  )
}
