// PATH: src/hooks/solana/useInvalidateGetBalanceQuery.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Fix react-hooks/exhaustive-deps warning on queryKey
'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { Address } from 'gill';
import { useWalletUi } from '@wallet-ui/react';
import { useCallback, useMemo } from 'react';

/**
 * A hook that returns a function to invalidate the balance query for a given address.
 * This is useful for triggering a balance refresh after a transaction.
 */
export function useInvalidateGetBalanceQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const queryClient = useQueryClient();

    // PATCH: Wrap queryKey in useMemo to avoid changing on every render
    const queryKey = useMemo(() => ['get-balance', { cluster, address }], [cluster, address]);

    return useCallback(() => {
        // console.log('Invalidating balance query:', queryKey);
        return queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]);
}

// PATCH NOTES:
// - queryKey is now memoized with useMemo ([cluster, address] as deps).
// - No more warning: The 'queryKey' array makes the dependencies of useCallback Hook change on every render.
// - Filename/path éternel, matrix override, batch fix grunge!