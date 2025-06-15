import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from '@/hooks/solana/useSolanaClient'
import { useEffect, useState } from 'react'

export function useStakeActivationStatus(pubkey: PublicKey, connection: Connection) {
  const [status, setStatus] = useState<{ state?: string, active?: number, inactive?: number } | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!pubkey) return

    getStakeActivationSafe(connection, pubkey)
      .then(result => {
        const normalized = {
          ...result,
          active: typeof result.active === 'bigint' ? Number(result.active) : result.active,
          inactive: typeof result.inactive === 'bigint' ? Number(result.inactive) : result.inactive,
        }
        setStatus(normalized)
      })
      .catch(err => setError(err))
  }, [pubkey, connection])

  return { status, error }
}
