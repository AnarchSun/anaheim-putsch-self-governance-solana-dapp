// PATH: src/hooks/solana/initializeAnaheimAccount.ts
// BATCH FIX: Anaheim account initializer, DAO self-governance grunge punk
// Lyric mirror: Ce fichier invoque la magie fractale du putsch et l’autogestion sacrée, initialisant l’identité anarcho-DAO sur Solana.

import { PublicKey, Keypair, Transaction, SystemProgram, Connection } from '@solana/web3.js'
import { callSolanaRpc } from "@/utils/solana/solanaRpcClient"

/**
 * Initializes an Anaheim self-governance account on Solana.
 * - Generates Keypair if none provided
 * - Sends a transaction to create account (SystemProgram.createAccount)
 * - Returns tx signature, new account publicKey, and result
 *
 * @param payerKeypair Keypair funding the account creation
 * @param lamports Amount to fund the new account (in lamports)
 * @param space Space (bytes) to allocate for the account, default: 0 (for system account)
 * @param programId Program ID for Anaheim (default: SystemProgram.programId)
 * @param connection
 * @returns { txSignature: string, newAccount: PublicKey }
 */
export async function initializeAnaheimAccount({
                                                   payerKeypair,
                                                   lamports = 1000000,
                                                   space = 0,
                                                   programId = SystemProgram.programId,
                                                   connection = null,
                                               }: {
    payerKeypair: Keypair,
    lamports?: number,
    space?: number,
    programId?: PublicKey,
    connection?: Connection | null,
}) {
    // Generate new Anaheim DAO account
    const newAccount = Keypair.generate();

    // Build transaction
    const tx = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payerKeypair.publicKey,
            newAccountPubkey: newAccount.publicKey,
            lamports,
            space,
            programId,
        })
    );

    // If direct connection is provided, send via @solana/web3.js
    if (connection) {
        const txSignature = await connection.sendTransaction(tx, [payerKeypair, newAccount]);
        return { txSignature, newAccount: newAccount.publicKey };
    } else {
        // Else: send via custom RPC proxy, punk style
        // Serialize transaction and send via callSolanaRpc
        // NOTE: This demo does NOT sign transaction! For real DAO, sign and serialize fully!
        const rawTx = tx.serialize().toString("base64"); // WARNING: This may error if not signed
        const result = await callSolanaRpc({
            method: "sendTransaction",
            params: [rawTx],
            id: Date.now(),
            jsonrpc: "2.0"
        });
        return {
            txSignature: result?.result || null,
            newAccount: newAccount.publicKey,
            rpcResult: result,
        };
    }
}