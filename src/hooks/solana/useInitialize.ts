// FILE: src/hooks/solana/useInitialize.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAnaheimProgram } from "@/hooks/useAnaheimProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Program, web3 } from "@coral-xyz/anchor";
import { Anaheim as AnaheimType } from "../../../anchor/target/types/anaheim";

export function useInitialize() {
    const { program, provider } = useAnaheimProgram();
    const wallet = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!provider || !program || !wallet.publicKey) {
                throw new Error("Missing provider, program, or wallet");
            }

            const typedProgram = program as Program<AnaheimType>;
            const [anaheimPda, bump] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), wallet.publicKey.toBuffer()],
                program.programId
            );

            await typedProgram.methods
                .initialize(bump)
                .accounts({
                    payer: wallet.publicKey,
                    anaheim: anaheimPda, // 🔥 FIXED HERE
                    systemProgram: web3.SystemProgram.programId,
                }as any)
                .rpc();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["anaheim-account"] });
        },
    });
}
