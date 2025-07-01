'use client'

import { StakeWatcher } from '@/components/stake/stake-watcher'
import { useState, useEffect, useCallback } from 'react'
import { getStakeActivationSafe } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'
import { PublicKey, Connection } from '@solana/web3.js'
import { ExplorerLink } from '@/components/account/account-detail-feature'
import { toast } from 'sonner'

function useTransactionToast(pubkeyString: string) {
  return useCallback(
    (signature: string) => {
      toast('Transaction sent', {
        description: (
          <ExplorerLink
            address={pubkeyString}
            transaction={signature}
            label="View Transaction"
          />
        ),
      })
    },
    [pubkeyString]
  )
}

export default function StakingPage() {
  const [status, setStatus] = useState<string>('')
  const pubkey = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')
  const pubkeyString = pubkey.toBase58()
  const notify = useTransactionToast(pubkeyString)

  useEffect(() => {
    async function fetchActivation() {
      try {
        const connection = new Connection('https://api.devnet.solana.com')
        const watcher = new getStakeActivationSafe(connection, 10000, pubkey)
        await watcher.fetch()
        setStatus(watcher.state ?? 'unknown')

        // Simuler une signature transactionnelle
        const fakeSignature = '5NJS3f...fakeSignature'
        notify(fakeSignature)
      } catch (err) {
        console.error('Erreur récupération stake:', err)
        setStatus('error')
      }
    }

    fetchActivation().catch(console.error)
  }, [pubkey, notify])

  return (
    <div className="p-6 bg-neutral-900 text-white rounded-xl shadow-lg border border-white/10 max-w-xl mx-auto mt-10">
      <StakeWatcher pubkeyString={pubkeyString} />
      <h1 className="text-3xl font-bold mb-4">🧪 Vérification du staking</h1>
      <p>{status}</p>
    </div>
  )
}
