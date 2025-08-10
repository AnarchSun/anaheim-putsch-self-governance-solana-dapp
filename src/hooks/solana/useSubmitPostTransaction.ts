// src/hooks/solana/useSubmitPostTransaction.ts
import {
    Instruction,
    TransactionSigner,
    Address,
    blockhash,
    TransactionVersion,
    signAndSendTransactionMessageWithSigners,
} from 'gill';

import type { BlockhashWithExpiryBlockHeight } from '@solana/web3.js';
import { useConnection } from '@/hooks/solana/useConnection';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { NominalType } from '@solana/nominal-types';  // Clé magique

export function useSubmitPostTransaction() {
    const { connection } = useConnection();
    const wallet = useWallet();

    return useMemo(() => {
        return async function submitPost(
            gillInstructions: Instruction[],
            latestBlockhash: BlockhashWithExpiryBlockHeight
        ) {
            if (!wallet.publicKey || !wallet.signTransaction) {
                throw new Error('Wallet not connected or does not support signing.');
            }

            const signer: TransactionSigner = {
                address: wallet.publicKey.toBase58() as Address,

                // Le cœur : transforme en signature typée nominalement
                signTransactions: async (
                    transactions,
                    config?
                ): Promise<readonly Readonly<Record<Address, NominalType<'brand', 'SignatureBytes'> & Uint8Array>>[]> => {
                    if (wallet.signAllTransactions) {
                        const signedTxs = await wallet.signAllTransactions(
                            transactions as any
                        );
                        return signedTxs.map((tx) =>
                            transactionToSignatureMap(tx, wallet.publicKey!.toBase58() as Address)
                        );
                    }

                    const results: Readonly<Record<Address, NominalType<'brand', 'SignatureBytes'> & Uint8Array>>[] = [];
                    for (const tx of transactions) {
                        const signedTx = await wallet.signTransaction!(tx as any);
                        results.push(
                            transactionToSignatureMap(signedTx, wallet.publicKey!.toBase58() as Address)
                        );
                    }
                    return results;
                },
            };

            const txInput = {
                version: 0 as TransactionVersion,
                feePayer: signer,
                instructions: gillInstructions,
                lifetimeConstraint: {
                    blockhash: blockhash(latestBlockhash.blockhash),
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                },
            } as any;

            return await signAndSendTransactionMessageWithSigners(txInput, {
                connection,
                signers: [signer],
            } as any);
        };
    }, [connection, wallet]);
}

/**
 * Injecte la marque nominale SignatureBytes sur un Uint8Array normal
 */
function asSignatureBytes(arr: Uint8Array): NominalType<'brand', 'SignatureBytes'> & Uint8Array {
    return arr as NominalType<'brand', 'SignatureBytes'> & Uint8Array;
}

/**
 * Crée la map des signatures attendue par gill avec le bon typage nominal.
 */
function transactionToSignatureMap(
    tx: any,
    signerAddress: Address
): Readonly<Record<Address, NominalType<'brand', 'SignatureBytes'> & Uint8Array>> {
    const map: Record<Address, NominalType<'brand', 'SignatureBytes'> & Uint8Array> = {};
    if (!tx.signatures || tx.signatures.length === 0)
        throw new Error('Transaction has no signatures');

    map[signerAddress] = asSignatureBytes(tx.signatures[0]);
    return map;
}
