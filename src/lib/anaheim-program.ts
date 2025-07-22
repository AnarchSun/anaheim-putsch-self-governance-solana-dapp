// FILE: src/lib/anaheim-program.ts
import { BorshAccountsCoder } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { IDL } from './idl/anaheim';

// This is the address of your deployed program.
export const ANAHEIM_PROGRAM_ID = new PublicKey('5ZZyxrMsJppuWipeEncWFZoz6W6Zkow5U8y8MaMA5p5A');

const accountPubKeyString = process.env.NEXT_PUBLIC_ANAHEIM_ACCOUNT_PUBKEY;
export const ANAHEIM_ACCOUNT_PUBKEY = accountPubKeyString ? new PublicKey(accountPubKeyString) : null;

// The rest of this file is correct and does not need to be changed.
export async function getAnaheimAccount(connection: Connection) {
    if (!ANAHEIM_ACCOUNT_PUBKEY) {
        throw new Error("FATAL: Anaheim account public key is not set in .env.local.");
    }

    IDL.address = ANAHEIM_PROGRAM_ID.toBase58();
    try {
        const accountInfo = await connection.getAccountInfo(ANAHEIM_ACCOUNT_PUBKEY);
        if (accountInfo === null) {
            console.error(`Account not found at address ${ANAHEIM_ACCOUNT_PUBKEY.toBase58()}.`);
            return null;
        }
        const coder = new BorshAccountsCoder(IDL);
        return coder.decode('anaheimAccount', accountInfo.data);
    } catch (error) {
        console.error(`Failed to decode the Anaheim account`, error);
        return null;
    }
}