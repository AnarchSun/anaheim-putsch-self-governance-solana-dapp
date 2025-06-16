// src/components/stake/stake-watcher.tsx
'use client'

import { useStakeWatcher } from '@/hooks/stake/useStakeWatcher'
import { PublicKey } from '@solana/web3.js'


export function StakeWatcher({ pubkeyString }: { pubkeyString: string }) {
  const pubkey = new PublicKey(pubkeyString)
  const { state, error, loading } = useStakeWatcher(pubkey)

  if (loading) return <p>🔄 Checking stake status...</p>
  if (error) return <p>⚠️ Error: {error.message}</p>
  if (!state) return <p>❌ No stake info found</p>

  return (
    <div className="rounded-xl p-4 bg-black/10 dark:bg-white/5">
      <h2 className="text-xl font-bold">🛰️ Stake Status</h2>
      <p>Status: <strong className="text-amber-400">{state}</strong></p>
    </div>
  )
}
