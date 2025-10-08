// src/hooks/solana/useAirdropMutation.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import {airdropFactory, lamports, type Address, createSolanaRpc, createSolanaRpcSubscriptions} from 'gill';
import { toast } from 'sonner';
import { toastTx } from '@/components/use-transaction-toast';
import { useWalletUi } from '@wallet-ui/react';


// Import the invalidation hooks
import { useInvalidateGetBalanceQuery } from './useInvalidateGetBalanceQuery';
import { useInvalidateGetSignaturesQuery } from './useInvalidateGetSignaturesQuery';

export function useAirdropMutation({ address }: { address: Address }) {
    // `client` is the RPC URL string (e.g., 'https://api.devnet.solana.com')
    const { client: rpcUrl } = useWalletUi();

    // ✅ FIX 2: Create the gill-compatible RPC and Subscription clients from the URL.
    const rpc = createSolanaRpc(rpcUrl);
    const rpcSubscriptions = createSolanaRpcSubscriptions(rpcUrl);

    // ✅ FIX 3: Pass the newly created client objects to the factory.
    const airdrop = airdropFactory({
        rpc,
        rpcSubscriptions,
    });

    // Get the invalidation functions from our new hooks
    const invalidateBalance = useInvalidateGetBalanceQuery({ address });
    const invalidateSignatures = useInvalidateGetSignaturesQuery({ address });

    return useMutation({
        mutationFn: async (amount: number = 1) =>
            airdrop({
                commitment: 'confirmed',
                recipientAddress: address,
                lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
            }),
        onSuccess: async (tx) => {
            toastTx(tx);
            // Invalidate both queries in parallel for efficiency
            await Promise.all([invalidateBalance(), invalidateSignatures()]);
        },
        onError: (error: Error) => {
            toast.error(`Airdrop failed! ${error.message}`);
        },
    });
}