// Contenu pour src/hooks/useInitialize.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAnaheimProgram } from "@/hooks/useAnaheimProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, PublicKey } from "@solana/web3.js";

export function useInitialize() {
    const { program, provider } = useAnaheimProgram();
    const wallet = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!provider || !program || !wallet.publicKey) {
                throw new Error("Programme ou portefeuille non prêt pour l'initialisation.");
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), wallet.publicKey.toBuffer()],
                program.programId
            );
            await program.methods.initialize(bump).accounts({
                anaheimAccount: pda,
                payer: wallet.publicKey,
                systemProgram: SystemProgram.programId,
            }as any).rpc();
        },
        onSuccess: () => {
            console.log("✅ Programme initialisé avec succès !");
            queryClient.invalidateQueries({ queryKey: ["anaheim-account"] });
        },
        onError: (err: Error) => {
            // On ignore souvent les erreurs "already in use" qui signifient que c'est déjà initialisé.
            if (!err.message.includes("already in use")) {
                console.error("❌ Erreur lors de l'initialisation :", err.message);
            }
        }
    });
}