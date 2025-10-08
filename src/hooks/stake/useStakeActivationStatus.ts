// PATH: src/hooks/stake/useStakeActivationStatus.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Remove unused constant pubkeyStr, batch fix grunge, filename/path éternel!

'use client'

import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

// Typage clair et strict
export type StakeActivationStatus = {
  state: 'active' | 'inactive' | 'activating' | 'deactivating'
  active: number
  inactive: number
}

// Simule un appel réel vers un backend Solana (à remplacer par ton codec plus tard)
export async function getStakeActivationSafe(): Promise<StakeActivationStatus> {
  return {
    state: 'active',
    active: 100,
    inactive: 0,
  }
}

// Hook vivant, miroir de la blockchain
export function useStakeActivationStatus(pubkey: PublicKey, connection: any) {
  const [status, setStatus] = useState<StakeActivationStatus | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pubkey || !connection) return

    setLoading(true)

    getStakeActivationSafe()
        .then((result) => {
          const normalized: StakeActivationStatus = {
            state: result.state as StakeActivationStatus['state'],
            active: result.active,
            inactive: result.inactive,
          }
          setStatus(normalized)
        })
        .catch((err: unknown) => {
          if (err instanceof Error) setError(err)
          else setError(new Error('Unknown error'))
        })
        .finally(() => {
          setLoading(false)
        })
  }, [pubkey, connection]) // PATCH: dependency array clean

  return {
    status,
    error,
    loading,
    state: status?.state,
  }
}

// PATCH NOTES:
// - Removed unused constant pubkeyStr
// - Filename/path éternel, batch fix grunge!