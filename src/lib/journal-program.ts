// FILE: src/lib/journal-program.ts
import { BorshAccountsCoder } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { IDL } from './idl/journal'; // Make sure your IDL is generated and exported correctly

// This is the correct Program ID for your journal program.
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
    const entryPda = findJournalEntryPda(owner, title);
    IDL.address = JOURNAL_PROGRAM_ID.toBase58();
    try {
        const accountInfo = await connection.getAccountInfo(entryPda);
        if (accountInfo === null) {
            return null; // It's normal for an entry not to exist, so no console error.
        }
        const coder = new BorshAccountsCoder(IDL);
        return coder.decode('journalEntryState', accountInfo.data);
    } catch (error) {
        console.error(`Failed to fetch or decode journal entry at ${entryPda.toBase58()}`, error);
        return null;
    }
}