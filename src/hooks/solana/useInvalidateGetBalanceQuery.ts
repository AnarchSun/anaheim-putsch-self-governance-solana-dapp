// src/hooks/solana/useInvalidateGetBalanceQuery.ts
'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { Address } from 'gill';
import { useWalletUi } from '@wallet-ui/react';
import { useCallback } from 'react';

/**
 * A hook that returns a function to invalidate the balance query for a given address.
 * This is useful for triggering a balance refresh after a transaction.
 */
export function useInvalidateGetBalanceQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const queryClient = useQueryClient();

    // The query key must exactly match the one used in `useGetBalanceQuery`.
    const queryKey = ['get-balance', { cluster, address }];

    return useCallback(() => {
        // console.log('Invalidating balance query:', queryKey);
        return queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]);
}