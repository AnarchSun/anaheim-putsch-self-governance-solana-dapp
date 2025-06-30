// File: src/hooks/stake/useStakeActivationSafe.ts

import { useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe, StakeActivationState } from '@/hooks/stake/useStakeWatcher'


export function useStakeActivationSafe(pubkey: PublicKey, connection: Connection) {
  const [state, setState] = useState<StakeActivationState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pubkey || !connection) return;

    let isMounted = true;
    const activation = new getStakeActivationSafe(connection, 5000, pubkey);

    setLoading(true);
    setError(null);

    activation.fetch()
      .then(() => {
        if (isMounted) {
          setState(activation.state);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pubkey?.toString(), connection]);

  return { state, loading, error };
}
