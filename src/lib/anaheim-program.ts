<<<<<<< HEAD
// FILE: src/lib/anaheim-program.ts
import { BorshAccountsCoder, Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Anaheim } from '../../anchor/target/types/anaheim';
import IDL from '../../anchor/target/idl/anaheim.json';
=======
// FILE: src/lib/anaheim-old-program.ts
import { BorshAccountsCoder, Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Anaheim } from '../../anchor/target/types/anaheim-old';
import IDL from '../../anchor/target/idl/anaheim-old.json';
>>>>>>> main

const programIdString = process.env.NEXT_PUBLIC_ANAHEIM_PROGRAM_ID;
if (!programIdString) { throw new Error("FATAL ERROR: Program ID not in .env"); }
export const ANAHEIM_PROGRAM_ID = new PublicKey(programIdString);

const accountPubKeyString = process.env.NEXT_PUBLIC_ANAHEIM_ACCOUNT_PUBKEY;
export const ANAHEIM_ACCOUNT_PUBKEY = accountPubKeyString ? new PublicKey(accountPubKeyString) : null;

export function createAnaheimProgram(connection: Connection, wallet: WalletContextState) {
    if (!wallet.publicKey) { throw new Error("Wallet not connected"); }
    const provider = new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
    const idl = { ...IDL, address: ANAHEIM_PROGRAM_ID.toBase58() };
<<<<<<< HEAD
    return new Program<Anaheim>(idl as any, provider);
=======
    const program = new Program<Anaheim>(idl as any, provider);
    return program;
>>>>>>> main
}

export async function getAnaheimAccount(connection: Connection) {
    if (!ANAHEIM_ACCOUNT_PUBKEY) { return null; }
    try {
        const accountInfo = await connection.getAccountInfo(ANAHEIM_ACCOUNT_PUBKEY);
        if (accountInfo === null) { return null; }
        const coder = new BorshAccountsCoder(IDL as any);
<<<<<<< HEAD
        // ===================================================================
        // THIS IS THE DEFINITIVE FIX FOR THE DECODING ERROR.
        // The account name in your complex project is `AnaheimAccount` (PascalCase).
        // ===================================================================
        return coder.decode('AnaheimAccount', accountInfo.data);
=======
        return coder.decode('anaheimAccount', accountInfo.data);
>>>>>>> main
    } catch (error) {
        console.error(`Failed to decode the Anaheim account`, error);
        return null;
    }
}