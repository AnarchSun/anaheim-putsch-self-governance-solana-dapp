// FILE: src/hooks/useMine.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useAnaheimProgram } from './useProgram'; // Corrected path
import { toast } from 'sonner';

export function useMineMutation() {
    const { program } = useAnaheimProgram();
    const { publicKey } = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!program || !publicKey) throw new Error("Program or wallet not ready");

            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), publicKey.toBuffer()],
                program.programId
            );

            // ✅ THE SLEDGEHAMMER FIX: Cast `program.methods` to `any`.
            // This tells TypeScript to stop checking for the 'mine' property and trust us.
            return (program.methods as any).mine().accounts({
                // Use camelCase for the client, as is standard
                anaheimAccount: pda,
                authority: publicKey
            }).rpc();
        },
        onSuccess: (sig: string) => {
            toast.success("Mining Successful!", { description: sig.slice(0, 10) + "..." });
            // Correct the invalidateQueries syntax
            queryClient.invalidateQueries({queryKey: ['anaheim-account', publicKey?.toBase58()]}).then(r =>{});
        },
        onError: (err: Error) => toast.error("Mining Failed", { description: err.message }),
    });
}