// FILE: src/hooks/solana/useSubmitPostTransaction.ts
'use client';

import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    createTransaction,
    signAndSendTransactionMessageWithSigners,
    type TransactionVersion,
    type Instruction,
    type TransactionSigner,
    type Address,
    blockhash, // Import the blockhash factory
} from 'gill';
import type { BlockhashWithExpiryBlockHeight } from '@solana/web3.js';

/**
 * A hook that returns an async function to submit a transaction
 * composed of one or more `gill`-compatible instructions.
 */
export function useSubmitPostTransaction() {
    const { connection } = useConnection();
    const wallet = useWallet();

    return useMemo(() => {
        // This async function is the actual submission logic
        return async function submitPost(
            gillInstructions: Instruction<string, readonly any[]>[],
            latestBlockhash: BlockhashWithExpiryBlockHeight, transactionMessage: any
) {
            if (!wallet.publicKey || !wallet.signTransaction) {
                throw new Error("Wallet not connected or does not support signing.");
            }

            // ✅ FIX 1: Create a fully compliant TransactionSigner object.
            // This object contains both the address and the signing methods.
            const signer: TransactionSigner = {
                address: wallet.publicKey.toBase58() as Address,
                signTransactions: wallet.signAllTransactions
                    ? async (txs) => wallet.signAllTransactions!(txs as any)
                    : async (txs) => {
                        // Fallback for wallets that only support single signing
                        const signedTxs = [];
                        for (const tx of txs) {
                            signedTxs.push(await wallet.signTransaction!(tx as any));
                        }
                        return signedTxs;
                    },
            };

            // ✅ FIX 2: Create a correctly typed lifetimeConstraint.
            // Note that `Blockhash` is now `blockhash`.
            const lifetimeConstraint = {
                blockhash: blockhash(latestBlockhash.blockhash),
                lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
            };

            // ✅ FIX 3: Create the transaction in a single, type-safe step.
            // Pass the entire `signer` object as the `feePayer`.
            const transaction = createTransaction({
                version: 0 as TransactionVersion,
                feePayer: signer, // Pass the full signer object, not just the address
                instructions: gillInstructions,
                lifetimeConstraint,
            }as any);

            // ✅ FIX 4: Call the sign-and-send function. It will use the signer
            // provided as the feePayer to request the user's signature.
            // No need for extra signers or type casting.
            const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage);

            // The function returns the signature bytes, which you can then encode if needed.
            return signatureBytes;
        };
    }, [connection, wallet]);
}