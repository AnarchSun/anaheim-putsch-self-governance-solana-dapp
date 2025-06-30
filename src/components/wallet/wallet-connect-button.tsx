// src/components/wallet/wallet-connect-button.tsx
'use client'

import { useEffect, useState } from 'react'
import { getStakeActivation } from '@/lib/solana/stake-utils'
import { Connection, PublicKey } from '@solana/web3.js'
import { StakeActivationState } from '@/hooks/stake/stake-codecs'

export function useStakeActivationStatus(pubkey: PublicKey, connection: Connection) {
  const [status, setStatus] = useState<StakeActivationState | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  const pubkeyStr = pubkey.toBase58()

  useEffect(() => {
    if (!pubkey || !connection) return

    setLoading(true)

    ;(async () => {
      try {
        const result = await getStakeActivation(pubkey, connection)

        setStatus({
          state: result.state,
          active: Number(result.active),
          inactive: Number(result.inactive),
        } as unknown as StakeActivationState)

        setError(null)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err)
        else setError(new Error('Erreur inconnue'))
      } finally {
        setLoading(false)
      }
    })()
  }, [pubkeyStr, connection])

  return { status, error, loading }
}
