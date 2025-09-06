// Path: hooks/solana/initializeAnaheimAccount.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Only logic, no UI, DRY and explicit.

import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export async function initializeAnaheimAccount(
    {
        getAccountInfo,
        getMinimumBalanceForRentExemption,
        sendTransaction,
    }: {
        getAccountInfo: (pubkey: PublicKey) => Promise<any>,
        getMinimumBalanceForRentExemption: (space: number) => Promise<number>,
        sendTransaction: (tx: Transaction, signers: any[]) => Promise<string>
    },
    accountAddress: string,
    payer: PublicKey,
    signers: any[],
): Promise<{ status: string; logs?: string[]; error?: string }> {
    try {
        const pubkey = new PublicKey(accountAddress);
        const accountInfo = await getAccountInfo(pubkey);

        if (accountInfo !== null) {
            return { status: "Compte déjà initialisé", error: "Account already exists" };
        }

        // Proceed to initialization
        const tx = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: pubkey,
                lamports: await getMinimumBalanceForRentExemption(0), // Adjust space as needed
                space: 0, // Set the actual required space for your account
                programId: new PublicKey("FZ1uRqV9P17MA2QP9ABmsvDP831UBjVicuc82SmrTykw"),
            })
        );
        const txid = await sendTransaction(tx, signers);

        return { status: "Initialisation réussie", logs: [`Transaction ID: ${txid}`] };
    } catch (err: any) {
        let logs = [];
        if (err?.logs) logs = err.logs;
        return { status: "Initialisation échouée", error: err.message || "Unknown error", logs };
    }
}