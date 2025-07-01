// anchor/src/journal-exports.ts
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import JournalIDL from '../target/idl/journal.json'
import type { Journal } from '../target/types/journal'
import { PublicKey } from '@solana/web3.js'

export const JOURNAL_PROGRAM_ID = new PublicKey(JournalIDL.address)

export function getJournalProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program(
    { ...JournalIDL, address: address?.toBase58() || JournalIDL.address } as Journal,
    provider
  )
}
