import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import {
    useMutation,
    UseMutationResult,
    useQueryClient
} from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@/hooks/solana/useConnection";
import { client } from "@/lib/solana";

interface TransferSolInput {
    destination: string;
    amount: number; // en SOL
}

// Type alias for UseMutationResult (for compatibility with your legacy code)
export type UseTransferSolMutationResult = UseMutationResult<string, Error, TransferSolInput>;

// Main hook for Solana transfer mutation
export function useTransferSolMutation(
    address: { address: any },
): UseTransferSolMutationResult {
    const queryClient = useQueryClient();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection(client.toString(), address, "confirmed");

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

            // Returns the transaction signature
            return await sendTransaction(tx, connection);
        },
        onSuccess: () => {
            // Invalidate account query to refetch balances etc
            void queryClient.invalidateQueries({ queryKey: ["anaheim-account"] });
        },
    });
}