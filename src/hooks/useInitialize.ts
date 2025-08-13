// FILE: src/hooks/useInitialize.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAnaheimProgram } from './useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';

export function useInitialize() {
    const queryClient = useQueryClient();
    const { program, provider } = useAnaheimProgram();
    const { publicKey } = useWallet();

    return useMutation({
        mutationKey: ['initialize', publicKey?.toBase58()],
        mutationFn: async () => {
            if (!program || !provider || !publicKey) {
                throw new Error("Wallet or program not ready!");
            }
            const [anaheimPda, _] = PublicKey.findProgramAddressSync(
              [Buffer.from("anaheim"), publicKey.toBuffer()],
              program.programId
            );

            // @ts-ignore
            const signature = await program.methods
              .initialize() // Correctly called with ZERO arguments
              .accounts({
                  // --- THIS IS THE FIX ---
                  anaheimAccount: anaheimPda,
                  // ---
                  payer: publicKey,
                  systemProgram: SystemProgram.programId,
              }as any)
              .rpc();

            const latestBlockhash = await provider.connection.getLatestBlockhash();
            await provider.connection.confirmTransaction({ signature, ...latestBlockhash });
            return signature;
        },
        onSuccess: (signature) => {
            toast.success('Program initialized successfully!', {
                description: `Transaction: ${signature}`,
                action: { label: 'View', onClick: () => window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank') },
            });
            return queryClient.invalidateQueries({ queryKey: ['anaheim-account'] });
        },
        onError: (error: Error) => {
            toast.error('Initialization failed!', { description: error.message });
        },
    });
}