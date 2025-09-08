import {
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

interface TransferSolInput {
    destination: string;
    amount: number; // en SOL
}

// ⚑ BATCH FIX: PURE ESM ONLY — NO module.exports, NO CommonJS anywhere.

// Remove unused constant useTransferSolMutation (if you have a duplicate or unused export, delete it below).
// Only export the main hook for usage in your components.

export function useSingTransactionMutation(
    _address: { address: any },
): UseMutationResult<string, Error, TransferSolInput> {
    const queryClient = useQueryClient();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    return useMutation<string, Error, TransferSolInput>({
        mutationFn: async ({ destination, amount }: TransferSolInput): Promise<string> => {
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

            // ✅ No options required here
            return await sendTransaction(tx, connection);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["anaheim-account"] });
        },
    });
}