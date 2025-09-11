// PATH: src/hooks/solana/useInvalidateGetSignaturesQuery.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Fix react-hooks/exhaustive-deps warning on queryKey
'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { Address } from 'gill';
import { useWalletUi } from '@wallet-ui/react';
import { useCallback, useMemo } from 'react';

/**
 * A hook that returns a function to invalidate the transaction signatures query.
 * This ensures the transaction history is updated after a new transaction is confirmed.
 */
export function useInvalidateGetSignaturesQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const queryClient = useQueryClient();

    // PATCH: Wrap queryKey in useMemo to avoid changing on every render
    const queryKey = useMemo(() => ['get-signatures-for-address', { cluster, address }], [cluster, address]);

    return useCallback(() => {
        // console.log('Invalidating signatures query:', queryKey);
        return queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]);
}

// PATCH NOTES:
// - queryKey is now memoized with useMemo ([cluster, address] as deps).
// - No more warning: The 'queryKey' array makes the dependencies of useCallback Hook change on every render.
// - Filename/path éternel, matrix override, batch fix grunge!