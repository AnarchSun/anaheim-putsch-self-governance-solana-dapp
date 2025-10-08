//
import {
    createTransaction,
    signAndSendTransactionMessageWithSigners,
    TransactionVersion,
    Instruction,
    TransactionSigner,
} from "gill";

import { Address } from "@solana/addresses";
import { BlockhashWithExpiryBlockHeight } from "@solana/web3.js";

export async function createTransactionWithSigners(param: {
    version: TransactionVersion;
    feePayer: Address;
    instructions: Instruction<string, readonly any[]>[];
    blockhash: string; // Remplace `lifetimeConstraint`
    signers: {
        address: Address;
        signTransaction: <T>(transaction: T) => Promise<T>;
    }[];
}) {
    const message = createTransaction({
        version: param.version,
        feePayer: param.feePayer,
        blockhash: param.blockhash, // 🔥 Utilise `blockhash` ici
        instructions: param.instructions,
    });

    return await signAndSendTransactionMessageWithSigners(message, {
        signers: param.signers,
    });
}



export function useSubmitPostTransaction() {
    const { connection } = useConnection();
    const wallet = useWallet();

    return useMemo(() => {
        return async function submitPost(
            gillInstructions: Instruction<string, readonly any[]>[],
            latestBlockhash: BlockhashWithExpiryBlockHeight
        ) {
            if (!wallet?.publicKey) throw new Error("Wallet not connected");
            if (!wallet.signTransaction) throw new Error("signTransaction unavailable");

            const feePayer = wallet.publicKey.toBase58() as Address;

            const lifetimeConstraint = {
                Blockhash: latestBlockhash.blockhash, // must be capital B
                lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
            };

            const { message, signers } = await createTransactionWithSigners({
                version: 0 as TransactionVersion, // cast propre
                feePayer,
                instructions: gillInstructions,
                lifetimeConstraint,
                signers: [
                    {
                        address: feePayer,
                        signTransaction: wallet.signTransaction,
                    },
                ],
            });

            return await signAndSendTransactionMessageWithSigners(message, {
                connection,
                signers,
            });
        };
    }, [connection, wallet]);
}
