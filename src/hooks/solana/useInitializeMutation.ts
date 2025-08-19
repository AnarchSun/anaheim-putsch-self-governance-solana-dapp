'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';

import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useAnaheimProgram } from "@/hooks/useAnaheimProgram";

// ====================================================
// Custom Hook for Initialize Mutation
// ====================================================
export function useInitializeMutation() {
    const { program } = useAnaheimProgram();
    const { publicKey } = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!program) throw new Error("Program not ready");
            if (!publicKey) throw new Error("Wallet not connected");

            console.log("🚀 Initializing program for pubkey:", publicKey.toBase58());

            // ✅ Derive PDA from seeds
            const [anaheimPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), publicKey.toBuffer()],
                program.programId
            );

            // ✅ Send initialize transaction
            const txSig = await (program.methods as any)
                .initialize()
                .accounts({
                    anaheimAccount: anaheimPda,
                    payer: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();


            // ✅ Confirm transaction using a new Solana pattern
            const { blockhash, lastValidBlockHeight } =
                await program.provider.connection.getLatestBlockhash('finalized');

            await program.provider.connection.confirmTransaction(
                { signature: txSig, blockhash, lastValidBlockHeight },
                'finalized'
            );

            console.log("✅ Tx sent:", txSig);
            return txSig;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['anaheimAccount']}).then(r =>{});
        },
        onError: (err) => {
            console.error("❌ Initialize failed:", err);
        }
    });
}
