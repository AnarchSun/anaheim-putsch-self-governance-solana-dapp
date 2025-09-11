// Path: src/app/stake-mining/stake/initStakeAccount.ts
// ULTRA FINAL ANARCHOPUNK BATCH PATCH:
// - "throw" replaced by early return
// - simulateTransaction deprecated: removed/simulateTransactionV0 not used (just do existence check)
// - usage clarified so function not unused
// - all errors batch fixed, all types explicit, filename ALWAYS at top, matrix hacked

import { PublicKey, Connection, Transaction, SystemProgram, TransactionSignature, SendOptions, Signer, sendAndConfirmTransaction } from "@solana/web3.js";

/**
 * Initialize an Anaheim account safely, never crash, always explicit.
 * Checks if an account exists before initializing.
 * Uses sendAndConfirmTransaction instead of deprecated sendTransaction.
 * Early returns for missing signers avoid deprecated simulation.
 */
export async function initializeAnaheimAccount(
    connection: Connection,
    accountAddress: string,
    payer: PublicKey,
    transaction?: Transaction | null,
    signers?: Signer[] | undefined,
    sendOptions?: SendOptions,
): Promise<{ status: string; logs?: string[]; error?: string }> {
    // Defensive: check signers before executing
    if (!signers || signers.length === 0) {
        return {
            status: "Initialisation échouée",
            error: "Missing required Signer[] for transaction. Payer must be a Signer (e.g. Keypair), not just PublicKey.",
            logs: [],
        };
    }
    try {
        // Check if account exists
        const pubkey = new PublicKey(accountAddress);
        const accountInfo = await connection.getAccountInfo(pubkey);

        if (accountInfo !== null) {
            return { status: "Compte déjà initialisé", error: "Account already exists. Impossible de réinitialiser.", logs: [] };
        }

        // Create account transaction
        const tx = transaction ?? new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: pubkey,
                lamports: await connection.getMinimumBalanceForRentExemption(0), // Adjust space as needed
                space: 0,
                programId: new PublicKey("83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB"),
            })
        );

        // Skipping simulation: simulateTransaction deprecated, just rely on the existence check above

        // Send and confirm the transaction
        const txid: TransactionSignature = await sendAndConfirmTransaction(
            connection,
            tx,
            signers,
            sendOptions
        );
        return { status: "Initialisation réussie", logs: [`Transaction ID: ${txid}`] };
    } catch (err: any) {
        // Defensive: get logs if possible
        let logs: string[] = [];
        if (err?.logs) logs = err.logs;
        return { status: "Initialisation échouée", error: err.message || "Unknown error", logs };
    }
}