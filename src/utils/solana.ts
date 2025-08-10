// FILE: src/utils/solana.ts

import { Connection, clusterApiUrl, Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";

/**
 * Defines the minimal interface for a wallet object that is compatible
 * with Anchor's `AnchorProvider`.
 */
interface AnchorWallet {
    publicKey: PublicKey;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
}

/**
 * A simple, minimal wallet implementation that wraps a Keypair.
 * This is useful for server-side scripts or tests.
 * It implements the `AnchorWallet` interface.
 */
class SimpleWallet implements AnchorWallet {
    public readonly publicKey: PublicKey;
    private readonly keypair: Keypair;

    constructor(keypair: Keypair) {
        this.publicKey = keypair.publicKey;
        this.keypair = keypair;
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
        // The `signTransaction` method on a Keypair is synchronous,
        // but the interface requires an async method.
        if ('version' in transaction) {
            // It's a VersionedTransaction
            transaction.sign([this.keypair]);
        } else {
            // It's a legacy Transaction
            transaction.partialSign(this.keypair);
        }
        return transaction;
    }

    async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
        // The `signAllTransactions` method on a Keypair is not standard.
        // We sign them one by one.
        return transactions.map((t) => {
            if ('version' in t) {
                t.sign([this.keypair]);
            } else {
                t.partialSign(this.keypair);
            }
            return t;
        });
    }
}

/**
 * Creates and returns a new AnchorProvider for server-side use.
 * @param keypair - The keypair to be used as the wallet.
 *                  If not provided, a new one will be generated.
 * @returns An instance of `AnchorProvider`.
 */
const getProvider = (keypair?: Keypair): AnchorProvider => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // Use the provided keypair or generate a new one.
    const wallet = new SimpleWallet(keypair ?? Keypair.generate());

    return new AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
    });
};

export { getProvider, SimpleWallet };