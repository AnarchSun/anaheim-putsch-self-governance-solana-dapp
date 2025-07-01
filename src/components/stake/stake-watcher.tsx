// src/components/stake/stake-watcher.tsx
'use client'

import { useStakeWatcher } from '@/hooks/stake/useStakeWatcher'
import { PublicKey } from '@solana/web3.js'

export function StakeWatcher({ pubkeyString }: { pubkeyString: string }) {
  const pubkey = new PublicKey(pubkeyString)
  const { state, loading, error } = useStakeWatcher(pubkey)

  if (loading) return <p>🔄 Checking stake status...</p>
  if (error) return <p>⚠️ Error: {error.message}</p>
  if (!state) return <p>❌ No stake info found</p>

  return (
    <div className="rounded-xl p-4 bg-black/10 dark:bg-white/5">
      <h2 className="text-xl font-bold">🛰️ Stake Status</h2>

      {state === 'active' && (
        <p className="text-green-500">Stake is active ✅</p>
      )}
      {state === 'inactive' && (
        <p className="text-red-500">Stake is inactive ❌</p>
      )}
      {state === 'activating' && (
        <p className="text-yellow-500">Stake is activating... ⚡</p>
      )}
      {state === 'deactivating' && (
        <p className="text-orange-500">Stake is deactivating... 💤</p>
      )}
      {state === 'uninitialized' && (
        <p className="text-gray-500">Uninitialized stake 😶</p>
      )}
    </div>
  )
}
