import {LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionSignature,} from "@solana/web3.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";

interface TransferSolInput {
    destination: string;
    amount: number; // en SOL
}

export function useTransferSolMutation() {
    const queryClient = useQueryClient();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    return useMutation({
        mutationFn: async ({ destination, amount }: TransferSolInput): Promise<TransactionSignature> => {
            if (!sendTransaction || !publicKey) {
                throw new Error("Wallet not connected");
            }

            const toPubkey = new PublicKey(destination);

            const ix = SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey,
                lamports: Math.round(amount * LAMPORTS_PER_SOL),
            });

            const tx = new Transaction().add(ix);


             // ✅ Aucune option requise ici
            return await sendTransaction(tx, connection);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["anaheim-account"] });
        },
    });
}
