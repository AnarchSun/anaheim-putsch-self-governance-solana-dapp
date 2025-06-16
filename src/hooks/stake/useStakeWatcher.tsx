import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from '../../../../vendor/solana-rpc-client-extensions/js/src/stake'

export type StakeActivationState =
  | 'active'
  | 'inactive'
  | 'activating'
  | 'deactivating'
  | 'uninitialized';

type StakeWatcherResult = {
  state: StakeActivationState | null;
  error: Error | null;
  loading: boolean;
};

export function useStakeActivationStatus(
  pubkey: PublicKey,
  connection: Connection,
  pollInterval = 10000,
): StakeWatcherResult {
  const [state, setState] = useState<StakeActivationState | null> ( null )
  const [error, setError] = useState<Error | null> ( null )
  const [loading, setLoading] = useState ( true )

  useEffect ( () => {
    if (!pubkey || !connection) return

    let cancelled = false

    const fetchAndSet = async () => {
      try {
        setLoading ( true )
        const instance = new getStakeActivationSafe ( connection, pollInterval, pubkey )
        await instance.fetch ()

        if (!cancelled) {
          setState ( instance.state as StakeActivationState )
          setError ( null )
        }
      } catch (e) {
        if (!cancelled) setError ( e as Error )
      } finally {
        if (!cancelled) setLoading ( false )
      }
    }

    fetchAndSet ().catch ( console.error )

    const interval = setInterval ( () => {
      fetchAndSet ().catch ( console.error )
    }, pollInterval )

    return () => {
      cancelled = true
      clearInterval ( interval )
    }
  }, [pubkey.toBase58 (), connection, pollInterval] )

  return { state, error, loading }
}

interface StakeWatcherProps {
  address?: string
}

export class StakeWatcher {
}