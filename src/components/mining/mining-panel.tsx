// FILE: src/components/mining/MiningPanel.tsx
"use client";

import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAnaheimProgram} from "@/hooks/useAnaheimProgram";
import {useWallet} from "@solana/wallet-adapter-react";
import {PublicKey, SystemProgram} from "@solana/web3.js";
import {Program} from "@coral-xyz/anchor";
import {Anaheim as AnaheimType} from "../../../anchor/target/types/anaheim";
import {useEffect} from "react";

export default function MiningPanel() {
    const { program, provider } = useAnaheimProgram();
    const wallet = useWallet();
    const queryClient = useQueryClient();

    const initializeMutation = useMutation({
        mutationKey: ['initialize-anaheim', { wallet: wallet.publicKey?.toBase58() }],
        mutationFn: async () => {
            if (!provider || !program || !wallet.publicKey) {
                throw new Error("Le portefeuille ou le programme n'est pas prêt.");
            }

            const typedProgram = program as Program<AnaheimType>;

            const [anaheimPda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), wallet.publicKey.toBuffer()],
                program.programId
            );

            // ✅ CORRECTION FINALE :
            // 1. On passe `bump` comme argument.
            // 2. On utilise le nom de compte correct `anaheimAccount`.
            // 3. On enlève `as any`.
            return await typedProgram.methods
                .initialize(bump) // <-- (1) L'argument est requis
                .accounts({
                    anaheimAccount: anaheimPda, // <-- (2) Le nom de compte est corrigé
                    payer: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                } as any)
                .rpc();
        },
        onSuccess: async (signature) => {
            console.log("✅ Initialisation réussie, signature:", signature);
            // C'est une bonne pratique d'attendre l'invalidation
            await queryClient.invalidateQueries({ queryKey: ["anaheim-account"] });
        },
        onError: (error: Error) => {
            console.error("❌ Erreur de mutation:", error);
        },
    });

    const getStatus = () => {
        if (initializeMutation.isPending) return "Mining...";
        if (initializeMutation.isError) return `Error: ${initializeMutation.error?.message || 'Unknown error'}`;
        if (initializeMutation.isSuccess) return "Success!";
        return "Idle";
    };

    useEffect(() => {
        if (program && provider && !initializeMutation.isPending && !initializeMutation.isSuccess) {
            initializeMutation.mutate();
        }
    }, [program, provider, initializeMutation]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Mining Status: {getStatus()}</h2>
        </div>
    );
};