// FILE: src/hooks/useIncrement.ts
'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAnaheimProgram } from "./useProgram";
import { useWallet } from "@solana/wallet-adapter-react";

// This is a correctly structured custom hook for the 'increment' mutation.
export function useIncrementMutation() {
    const { program } = useAnaheimProgram();
    const { publicKey } = useWallet();
    const queryClient = useQueryClient();

    // useMutation expects an object as its argument
    return useMutation({
        // The async logic goes inside the 'mutationFn' property
        mutationFn: async () => {
            if (!program || !publicKey) {
                throw new Error("Program or wallet not ready");
            }

            // You must re-derive the PDA here to know which account to increment
            const [pda] = (await import('@solana/web3.js')).PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), publicKey.toBuffer()],
                program.programId
            );

            return await program.methods
                .increment()
                .accounts({
                    anaheimAccount: pda,
                    authority: publicKey,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            console.log("Increment successful!", signature);
            // This is crucial: invalidate the query to force a refetch of the account data
            queryClient.invalidateQueries({queryKey: ['anaheim-account', publicKey?.toBase58()]}).then(r =>{});
        },
        onError: (error: Error) => {
            console.error("Increment failed:", error);
            // You can add a toast notification for the error here
        }
    });
}