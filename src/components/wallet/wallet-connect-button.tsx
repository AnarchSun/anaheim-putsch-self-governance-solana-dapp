'use client'

import { useEffect, useState } from 'react'
import { getStakeActivation } from '@/lib/solana/stake-utils'
import { Connection, PublicKey } from '@solana/web3.js'
import { StakeActivationState } from '@/hooks/stake/stake-codecs'
import { string } from 'superstruct'

export function useStakeActivationStatus(pubkey: PublicKey, connection: Connection) {
  const [status, setStatus] = useState<StakeActivationState | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pubkey || !connection) return

    setLoading(true)

    ;(async () => {
      try {
        const result = await getStakeActivation(pubkey, connection)

        // ⚠️ S'assurer que `result` respecte StakeActivationState
        const normalized: { state: string; active: number; inactive: number } = {
          state: result.state,
          active: Number(result.active),
          inactive: Number(result.inactive),
        }

        setStatus( result as unknown as StakeActivationState)
      } catch (err: any){
        string;
        number;
        number;
      }finally {
        setLoading(false)
      }
    })()
  }, [pubkey.toBase58(), connection])

  return { status, error, loading }
}
