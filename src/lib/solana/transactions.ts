// src/lib/solana/transactions.ts
import {
    createTransaction,
    signAndSendTransactionMessageWithSigners,
} from 'gill';
import { Connection } from '@solana/web3.js';
import { Address } from '@solana/addresses';

type Props = {
    gillInstructions: IInstruction[];
    latestBlockhash: {
        blockhash: string;
        lastValidBlockHeight: number;
    };
    signer: {
        address: Address<string>;
        signTransaction: (tx: any) => Promise<any>;
    };
    connection: Connection;
};

export async function sendGillTx({
                                     gillInstructions,
                                     latestBlockhash,
                                     signer,
                                     connection,
                                 }: Props) {
    // ✅ CORRECT field names for Gill SDK
    const transactionMessage = createTransaction({
        version: 0,
        feePayer: signer.address,
        instructions: gillInstructions,
        lifetimeConstraint: {
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
        },
    });

    // ✅ This is the correct call: message = transactionMessage
    const txSig = await signAndSendTransactionMessageWithSigners({
        message: transactionMessage,
        signers: [signer],
        connection,
    });

    return txSig;
}
