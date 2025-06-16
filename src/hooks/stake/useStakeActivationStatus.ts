import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { StakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'

type StakeActivationStatus = {
  state?: string
  active?: number
  inactive?: number
}

// Fonction asynchrone qui déchiffre l'activation du stake
export async function getStakeActivationSafe(
): Promise<{ state: string; active: number; inactive: number } | StakeActivation> {
  // Ici, l'appel à la vraie fonction RPC ou ton algorithme d'activation
  // Pour l'instant, simulons un résultat:
  return {
    state: 'active',
    active: 100,
    inactive: 0,
  }
}

// Hook React, miroir vivant
export function useStakeActivationStatus(pubkey: PublicKey, connection: Connection) {
  const [status, setStatus] = useState<StakeActivationStatus | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!pubkey || !connection) return

    getStakeActivationSafe()
      .then((result) => {
        const normalized = {
          ...result,
          active: typeof result.active === 'bigint' ? Number(result.active) : result.active,
          inactive: typeof result.inactive === 'bigint' ? Number(result.inactive) : result.inactive,
        }
        setStatus(normalized)
      })
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err)
        else setError(new Error('Unknown error'))
      })
  }, [pubkey.toBase58(), connection])

  return { status, error,
    loading: false, state: undefined,

  }
}
