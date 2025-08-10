// src/lib/solana/convertToGillInstruction.ts
import { address, AccountRole, Instruction, AccountMeta as GillAccountMeta } from 'gill';
import { TransactionInstruction, AccountMeta as Web3AccountMeta } from '@solana/web3.js';

/**
 * Convertit une TransactionInstruction (web3.js) en Instruction (gill)
 */
export function convertToGillInstruction(ix: TransactionInstruction): Instruction {
    const mappedAccounts: GillAccountMeta[] = ix.keys.map((web3Key: Web3AccountMeta) => {
        let role: AccountRole;
        if (web3Key.isSigner) {
            role = AccountRole.WRITABLE_SIGNER;
        } else if (web3Key.isWritable) {
            role = AccountRole.WRITABLE;
        } else {
            role = AccountRole.READONLY;
        }

        return {
            address: address(web3Key.pubkey.toBase58()),
            role,
        };
    });

    return {
        programAddress: address(ix.programId.toBase58()),
        accounts: mappedAccounts,
        data: ix.data,
    };
}
