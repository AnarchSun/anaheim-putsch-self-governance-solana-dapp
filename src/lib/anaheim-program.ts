// FILE: src/lib/anaheim-program.ts
import { BorshAccountsCoder } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { IDL } from './idl/anaheim';

// This is correct, it's the address of your deployed program.
export const ANAHEIM_PROGRAM_ID = new PublicKey('FV9aAVcF157mf2mKn9BiU9LDCkxuTwsD9wU6BdcDRv6R');

// ===================================================================
// PASTE THE NEW ADDRESS FROM YOUR TERMINAL OUTPUT HERE.
// This is the address of the data account you just created.
// ===================================================================
export const ANAHEIM_ACCOUNT_PUBKEY = new PublicKey('PASTE_YOUR_NEW_KEY_HERE');

/**
 * Fetches and decodes the global Anaheim state account.
 */
export async function getAnaheimAccount(connection: Connection) {
    IDL.address = ANAHEIM_PROGRAM_ID.toBase58();
    try {
        const accountInfo = await connection.getAccountInfo(ANAHEIM_ACCOUNT_PUBKEY);
        if (accountInfo === null) {
            console.error(`Account not found at ${ANAHEIM_ACCOUNT_PUBKEY.toBase58()}. Make sure you have run 'anchor run initialize'.`);
            return null;
        }
        const coder = new BorshAccountsCoder(IDL);
        return coder.decode('anaheimAccount', accountInfo.data);
    } catch (error) {
        console.error(`Failed to fetch or decode the Anaheim account`, error);
        return null;
    }
}