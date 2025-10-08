// src/hooks/solana/useTransferSolMutation.ts

import { useCallback } from 'react';
import {
    Address,
    createTransactionMessage,
    signAndSendTransactionMessageWithSigners,
    type TransactionSigner,
    type CompilableTransactionMessage,
    type TransactionMessage,
} from 'gill';
import { useWalletUi, type UiWalletAccount } from '@wallet-ui/react';
import { getTransferSolInstruction } from 'gill/programs';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Brand, EncodedString } from '@solana/nominal-types';

const connection = new Connection(clusterApiUrl('devnet'));

export type Blockhash = Brand<EncodedString<string, 'base58'>, 'Blockhash'>;

export async function getLatestBlockhash(): Promise<{
    Blockhash: Blockhash;
    lastValidBlockHeight: bigint;
}> {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    return {
        Blockhash: blockhash as Blockhash,
        lastValidBlockHeight: BigInt(lastValidBlockHeight),
    };
}

// Création du signer conforme au type TransactionSigner
function createTransactionSignerFromWalletAdapter(
    account: UiWalletAccount
): TransactionSigner {
    if (!account.signTransactionMessage) {
        throw new Error('Wallet signer unavailable');
    }

    return {
        address: account.address as Address,
        signTransactionMessage: account.signTransactionMessage,
    };
}

export function useTransferSolMutation() {
    const { account } = useWalletUi();

    const transferSol = useCallback(
        async ({ destination, amount }: { destination: Address; amount: number }) => {
            if (!account) throw new Error('Wallet not connected');

            const signer = createTransactionSignerFromWalletAdapter(account);
            const { Blockhash, lastValidBlockHeight } = await getLatestBlockhash();

            // feePayer doit être juste une address (string brandée)
            const feePayer: Address = signer.address;

            const instruction = getTransferSolInstruction({
                source: feePayer,
                destination,
                amount,
            });

            const txData: CompilableTransactionMessage = {
                version: 0,
                feePayer,
                instructions: [instruction],
                lifetimeConstraint: {
                    Blockhash,
                    lastValidBlockHeight,
                },
            };

            // Création du message transactionnel (avec la bonne forme)
            const message: TransactionMessage = createTransactionMessage(txData);

            // On envoie la transaction signée
            return await signAndSendTransactionMessageWithSigners(message, [signer]);
        },
        [account]
    );

    return { transferSol };
}
