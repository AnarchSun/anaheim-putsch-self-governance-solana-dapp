// FILE: src/components/mining/MiningPanel.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAnaheimProgram } from "@/hooks/useAnaheimProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Anaheim as AnaheimType } from "../../../anchor/target/types/anaheim";
import { useEffect, useState } from "react";

export function useInitialize() {
    const { program, provider } = useAnaheimProgram();
    const wallet = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!provider || !program || !wallet.publicKey) {
                throw new Error("Missing provider or wallet");
            }

            const typedProgram = program as Program<AnaheimType>;

            const [anaheimPda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), wallet.publicKey.toBuffer()],
                program.programId
            );

            await (typedProgram.methods.initialize(bump) as any)
                .accounts({
                    payer: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                    anaheim: anaheimPda,
                })
                .rpc();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["anaheim-account"]}).then(_r => useQueryClient());
        },
    });
}

export default function MiningPanel() {
    const { program, provider } = useAnaheimProgram();
    const [status, setStatus] = useState<string>("Idle");
    const initializeMutation = useInitialize();

    const handleMine = async () => {
        if (!provider?.wallet?.publicKey) return;
        setStatus("Mining...");

        try {
            await initializeMutation.mutateAsync();
            setStatus("Success!");
        } catch (err) {
            console.error("Mining error:", err);
            setStatus("Error");
        }
    };

    useEffect(() => {
        handleMine().then(_r =>(useQueryClient() as any).invalidateQueries() );
    }, [program, provider]);

    return (
        <div>
            <h2>Mining Status: {status}</h2>
        </div>
    );
}
