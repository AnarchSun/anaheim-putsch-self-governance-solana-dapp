// src/hooks/solana/useInvalidateGetSignaturesQuery.ts
'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { Address } from 'gill';
import { useWalletUi } from '@wallet-ui/react';
import { useCallback } from 'react';

/**
 * A hook that returns a function to invalidate the transaction signatures query.
 * This ensures the transaction history is updated after a new transaction is confirmed.
 */
export function useInvalidateGetSignaturesQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const queryClient = useQueryClient();

    // This query key should match the one used in your hook that fetches signatures
    // (e.g., `useGetSignaturesQuery`).
    const queryKey = ['get-signatures-for-address', { cluster, address }];

    return useCallback(() => {
        // console.log('Invalidating signatures query:', queryKey);
        return queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]);
}