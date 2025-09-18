// FILE: src/hooks/solana/initializeAnaheimAccount.ts

import { PublicKey, Keypair, Transaction, SystemProgram, Connection, VersionedTransaction, TransactionMessage, SendOptions } from '@solana/web3.js'
import { callSolanaRpc } from "@/utils/solana/solanaRpcClient"

class txSignature {}

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
}): Promise<txSignature> {
    // Generate new Anaheim DAO account
    const newAccount = Keypair.generate();

    // Build transaction instructions
    const ix = SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports,
        space,
        programId,
    });

    // If direct connection is provided, send via @solana/web3.js using VersionedTransaction
    if (connection) {
        // Fetch recent blockhash
        const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Create TransactionMessage for VersionedTransaction (v0)
        const messageV0 = new TransactionMessage({
            payerKey: payerKeypair.publicKey,
            recentBlockhash,
            instructions: [ix]
        }).compileToV0Message();

        const versionedTx = new VersionedTransaction(messageV0);

        // Sign with payer and newAccount
        versionedTx.sign([payerKeypair, newAccount]);

        // Send using sendTransaction (modern, non-deprecated)
        const sendOpts: SendOptions = { preflightCommitment: 'processed' };
        const txSignature = await connection.sendTransaction(versionedTx, sendOpts);
        return { txSignature, newAccount: newAccount.publicKey };
    } else {
        // Else: send via custom RPC proxy, punk style
        // Fallback: Use legacy Transaction, warn about deprecation
        const tx = new Transaction().add(ix);
        tx.recentBlockhash = (await callSolanaRpc({
            method: "getLatestBlockhash",
            params: [],
            id: Date.now(),
            jsonrpc: "2.0"
        }))?.result?.blockhash || ""; // fallback blockhash
        tx.feePayer = payerKeypair.publicKey;
        tx.sign(payerKeypair, newAccount);

        // Serialize transaction and send via callSolanaRpc
        const rawTx = tx.serialize().toString("base64");
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