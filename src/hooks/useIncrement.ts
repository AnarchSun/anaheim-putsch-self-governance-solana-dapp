// FILE: src/hooks/useIncrement.ts
'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAnaheimProgram } from "./useProgram";
import { useWallet } from "@solana/wallet-adapter-react";

/**
 * Custom hook to increment the Anaheim account counter.
 * To use: call useIncrementMutation() in your component,
 * then use its mutate() method when you want to trigger the increment.
 */
export function useIncrementMutation() {
    const { program } = useAnaheimProgram();
    const { publicKey } = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!program || !publicKey) {
                throw new Error("Program or wallet not ready");
            }

            // Derive the PDA for 'base' (anaheimAccount)
            const [base] = (await import('@solana/web3.js')).PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), publicKey.toBuffer()],
                program.programId
            );

            // Pass only 'base' as account -- IDL expects only 'base' here
            return await program.methods
                .increment()
                .accounts({
                    base
                })
                .rpc();
        },
        onSuccess: (signature) => {
            console.log("Increment successful!", signature);
            queryClient.invalidateQueries({queryKey: ['anaheim-account', publicKey?.toBase58()]});
        },
        onError: (error: Error) => {
            console.error("Increment failed:", error);
        }
    });
}

/*
 * Usage Example (to avoid "unused function" warning):
 *
 * import { useIncrementMutation } from "@/hooks/useIncrement";
 *
 * function IncrementButton() {
 *   const incrementMutation = useIncrementMutation();
 *   return (
 *     <button
 *       disabled={incrementMutation.isLoading}
 *       onClick={() => incrementMutation.mutate()}
 *     >
 *       {incrementMutation.isLoading ? "Incrementing..." : "Increment"}
 *     </button>
 *   );
 * }
 *
 * // Place <IncrementButton /> somewhere in your UI.
 */