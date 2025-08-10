// FILE: src/lib/solana/transactions.ts

import {
    createTransaction,
    signAndSendTransactionMessageWithSigners,
    type Instruction,
    type TransactionSigner,
    blockhash as toGillBlockhash, // Import the blockhash factory
} from 'gill';
import type { Connection } from '@solana/web3.js';

// Define a clear set of properties for the function
type SendGillTxProps = {
    instructions: Instruction[];
    latestBlockhash: {
        blockhash: string;
        lastValidBlockHeight: number;
    };
    // The signer should conform to the `TransactionSigner` interface from gill
    signer: TransactionSigner;
    connection: Connection; // Although not used by gill's primary function, it can be useful for context
};

/**
 * Creates, signs, and sends a transaction using the gill library and a provided signer.
 * @returns The transaction signature as a Uint8Array (SignatureBytes).
 */
export async function sendGillTx({
     instructions,
     latestBlockhash,
     signer,
 }: SendGillTxProps, transactionMessage: any): Promise<Uint8Array> { // The return type is Uint8Array (SignatureBytes)

    // 1. Create a `gill`-compatible transaction.
    // The `feePayer` is the entire `signer` object.
    const transaction = createTransaction({
        version: 0,
        feePayer: signer, // ✅ Pass the full signer object
        instructions: instructions,
        lifetimeConstraint: {
            blockhash: toGillBlockhash(latestBlockhash.blockhash), // ✅ Use the factory for type safety
            lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
        },
    }as any);

    // 2. Sign and send the transaction in a single step.
    // The linter warning is resolved by returning the promise directly.
    return await signAndSendTransactionMessageWithSigners(transactionMessage);
}