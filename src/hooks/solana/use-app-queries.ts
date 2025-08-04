// FILE: src/hooks/solana/use-app-queries.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { type Address } from 'gill';
import { useWalletUi } from '@wallet-ui/react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

export function useGetBalanceQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const connection = new Connection(clusterApiUrl(cluster));

    return useQuery({
        queryKey: ['get-balance', { cluster, address }],
        queryFn: () => {
            if (!address) return null;
            return connection.getBalance(new PublicKey(address));
        },
        enabled: !!address, // La requête ne se lance que si l'adresse existe
    });
}

// Vous pouvez ajouter ici les autres hooks de requête (useGetSignaturesQuery, etc.)