// FILE: src/hooks/solana/initializeAnaheimAccount.ts
import { PublicKey, Keypair, SystemProgram, Connection, VersionedTransaction, TransactionMessage, SendOptions } from '@solana/web3.js'

export type InitAnaheimResult = {
    status: string;
    error?: string;
    logs?: string[];
    txSignature?: string;
    newAccount?: PublicKey;
};

/**
 * Initialize an Anaheim self-governance account on Solana
 */
export async function initializeAnaheimAccount(
    connection: Connection,
    accountAddress: string,
    payerPubkey: PublicKey,
    payerKeypair: (Keypair | Keypair)[], // must sign the tx
    signers: Keypair[] = [],
): Promise<InitAnaheimResult> {

    try {
        // Generate new Anaheim DAO account
        const newAccount = Keypair.generate();

        // TODO: set lamports, space, programId according to your program
        const space = 128;
        const lamports = await connection.getMinimumBalanceForRentExemption(space);
        const programId = new PublicKey(accountAddress); // adjust if needed

        // Build instruction
        const ix = SystemProgram.createAccount({
            fromPubkey: payerPubkey,
            newAccountPubkey: newAccount.publicKey,
            lamports,
            space,
            programId,
        });

        // Prepare versioned transaction
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('processed');
        const messageV0 = new TransactionMessage({
            payerKey: payerPubkey,
            recentBlockhash: blockhash,
            instructions: [ix],
        }).compileToV0Message();

        const versionedTx = new VersionedTransaction(messageV0);
        versionedTx.sign([payerKeypair, newAccount, ...signers]);

        // Send transaction
        const txSignature = await connection.sendTransaction(versionedTx, { preflightCommitment: 'processed' } as SendOptions);

        // Confirm transaction safely (versioned tx compatible)
        await connection.confirmTransaction({
            signature: txSignature,
            blockhash,
            lastValidBlockHeight,
        });

        // Fetch logs from versioned transaction
        const confirmedTx = await connection.getTransaction(txSignature, {
            maxSupportedTransactionVersion: 0,
        });
        const logs = confirmedTx?.meta?.logMessages || [];

        return {
            status: "Initialisation réussie",
            txSignature,
            newAccount: newAccount.publicKey,
            logs,
        };

    } catch (err: any) {
        return {
            status: "Erreur lors de l'initialisation",
            error: err.message,
            logs: [],
        };
    }
}
