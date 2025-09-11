// PATH: src/hooks/useInitialize.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Remove unused parameters 'signature' (onSuccess), 'r' (then), batch fix grunge, filename/path éternel!

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';
import { useAnaheimProgram } from './useProgram';

export function useInitializeMutation() {
    const queryClient = useQueryClient();
    const { program, provider } = useAnaheimProgram();
    const { publicKey } = useWallet();

    return useMutation({
        mutationKey: ['initialize-program', publicKey?.toBase58()],
        mutationFn: async () => {
            if (!program || !provider || !publicKey) {
                throw new Error("Wallet or program not ready!");
            }
            const [pda] = PublicKey.findProgramAddressSync([Buffer.from("anaheim"), publicKey.toBuffer()], program.programId);

            const signature = await program.methods
                .initialize()
                .accounts({
                    anaheimAccount: pda,
                    payer: publicKey,
                    systemProgram: SystemProgram.programId,
                } as any)
                .rpc();

            // ✅ THE FIX for the 'confirmTransaction' error.
            // The modern syntax requires an object with the signature and blockhash info.
            const latestBlockhash = await provider.connection.getLatestBlockhash();
            await provider.connection.confirmTransaction({
                signature,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
            }, 'confirmed');

            return signature;
        },
        onSuccess: () => {
            toast.success('Program initialized successfully!');
            queryClient.invalidateQueries({queryKey: ['anaheim-account', publicKey?.toBase58()]}).then(() =>{} );
        },
        onError: (error: Error) => {
            toast.error('Initialization failed!', { description: error.message });
        },
    });
}

// PATCH NOTES:
// - Removed unused parameter 'signature' in onSuccess
// - Removed unused parameter 'r' in then callback
// - Filename/path éternel, batch fix grunge!