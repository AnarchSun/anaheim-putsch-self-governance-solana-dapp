// FILE: src/lib/journal-program.ts

import { BorshAccountsCoder } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import  IDL from '../../anchor/target/idl/journal.json';
import {address} from "gill"; // Assuming IDL is exported from a generated file

// This is the correct Program ID for /your journal program.
export const JOURNAL_PROGRAM_ID = new PublicKey('2G2EN3Jr2Ss3q3kYwCT1A6y6Rc5t2J6qCxE2fkYKv3pN');

/**
 * Helper function to find the Program Derived Address (PDA) for a journal entry.
 */
export function findJournalEntryPda(owner: PublicKey, title: string): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        JOURNAL_PROGRAM_ID
    );
    return pda;
}

/**
 * Fetches and decodes a specific journal entry account.
 */
export async function getJournalEntry(connection: Connection, owner: PublicKey, title: string) {
    // First, find the address of the account.
    const entryPda = findJournalEntryPda(owner, title);

    try {
        const accountInfo = await connection.getAccountInfo(entryPda);
        if (accountInfo === null) {
            console.log(`Journal entry with title "${title}" not found for owner ${owner.toBase58()}`);
            return null;
        }

        let coder: BorshAccountsCoder<string>;
        coder = new BorshAccountsCoder(IDL as any);

        // ===================================================================
        // THIS IS THE DEFINITIVE FIX.
        // 1. The problematic line `IDL.address = ...` has been REMOVED. It is unnecessary
        //     for decoding and was causing the TypeScript crash.
        // 2. The account name now correctly uses "JournalEntryState" (PascalCase)
        //    to match your IDL, fixing a hidden bug.
        // ===================================================================
        return coder.decode('JournalEntryState', accountInfo.data);

    } catch (error) {
        console.error(`Failed to fetch or decode journal entry at ${entryPda.toBase58()}`, error);
        return null;
    }
}