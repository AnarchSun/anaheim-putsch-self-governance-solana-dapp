// FILE: src/lib/anaheim-program.ts
import { BorshAccountsCoder } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { IDL } from './idl/anaheim';

// Use the correct Program ID from your latest deployment.
export const ANAHEIM_PROGRAM_ID = new PublicKey('FV9aAVcF157mf2mKn9BiU9LDCkxuTwsD9wU6BdcDRv6R');

// This is the known, single public key of your AnaheimAccount on devnet.
// You will get this from running the initialization script.
export const ANAHEIM_ACCOUNT_PUBKEY = new PublicKey('YOUR_ANAHEIM_ACCOUNT_PUBLIC_KEY_ON_DEVNET_HERE');

/**
 * Fetches and decodes the global Anaheim state account using a direct RPC call.
 */
export async function getAnaheimAccount(connection: Connection) {
    // FIX: Update the IDL in memory with the correct program address.
    IDL.address = ANAHEIM_PROGRAM_ID.toBase58();
    try {
        const accountInfo = await connection.getAccountInfo(ANAHEIM_ACCOUNT_PUBKEY);
        if (accountInfo === null) {
            console.error(`Account not found at ${ANAHEIM_ACCOUNT_PUBKEY.toBase58()}`);
            return null;
        }

        const coder = new BorshAccountsCoder(IDL);
        return coder.decode('AnaheimAccount', accountInfo.data);

    } catch (error) {
        console.error(`Failed to fetch or decode the Anaheim account at ${ANAHEIM_ACCOUNT_PUBKEY.toBase58()}`, error);
        return null;
    }
}