// FILE: src/lib/anaheim-program.ts
import {AnchorProvider, BorshAccountsCoder, Program} from '@coral-xyz/anchor';
import {Connection, PublicKey} from '@solana/web3.js';
import {WalletContextState} from '@solana/wallet-adapter-react';
import {Anaheim} from '../../anchor/target/types/anaheim';
import IDL from '../../anchor/target/idl/anaheim.json';


const programIdString = process.env.NEXT_PUBLIC_ANAHEIM_PROGRAM_ID;

if (!programIdString) {
    throw new Error('FATAL ERROR: Program ID not in .env');
}
export const ANAHEIM_PROGRAM_ID = new PublicKey(programIdString);

const accountPubKeyString = process.env.NEXT_PUBLIC_ANAHEIM_ACCOUNT_PUBKEY;
export const ANAHEIM_ACCOUNT_PUBKEY = accountPubKeyString ? new PublicKey(accountPubKeyString) : null;

export function createAnaheimProgram(connection: Connection, wallet: WalletContextState) {
    if (!wallet.publicKey) { throw new Error("Wallet not connected"); }
    const provider = new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
    const idl = { ...IDL, address: ANAHEIM_PROGRAM_ID.toBase58() };
    return new Program<Anaheim>(idl as any, provider);
}

export const getAnaheimAccount = async (
    connection: Connection, // ✅ le bon type
    walletPubkey: PublicKey,
    programId: PublicKey = ANAHEIM_PROGRAM_ID
) => {
    const addressSync = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), walletPubkey.toBuffer()],
        programId
    );

    const accountInfo = await connection.getAccountInfo(addressSync[0]);
    if (!accountInfo) return null;

    try {
        if (ANAHEIM_ACCOUNT_PUBKEY instanceof PublicKey) {
            const accountInfo = await connection.getAccountInfo(ANAHEIM_ACCOUNT_PUBKEY);
        }

        const coder = new BorshAccountsCoder(IDL as any);
        return coder.decode('anaheimAccount', accountInfo.data);
    } catch (error) {
        console.error(`Failed to decode the Anaheim account`, error);
        return null;
    }
};
