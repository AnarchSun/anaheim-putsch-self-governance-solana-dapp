// FILE: src/hooks/useAnaheimAccount.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { useAnaheimProgram } from './useProgram';
import { Program } from '@coral-xyz/anchor';
import { Anaheim } from '@/types/anaheim';

// Helper function to fetch account data. It returns null if not found.
async function getAnaheimAccount(program: Program<Anaheim> | undefined, userPublicKey: PublicKey | null) {
    if (!program || !userPublicKey) {
        return null;
    }
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), userPublicKey.toBuffer()],
        program.programId
    );
    try {
        return await program.account.anaheimAccount.fetch(pda);
    } catch (error) {
        console.log("Account not found, which is expected before initialization.");
        return null;
    }
}

// This is the reusable custom hook for fetching the account state.
export function useAnaheimAccount(publicKey: PublicKey | undefined | null) {
    const { program } = useAnaheimProgram();

    return useQuery({
        // The query key uniquely identifies this data, dependent on the user.
        queryKey: ['anaheim-account', publicKey?.toBase58()],

        // The function that performs the fetch.
        queryFn: () => getAnaheimAccount(program, publicKey),

        // Only run this query if the program and wallet are ready.
        enabled: !!program && !!publicKey,
    });
}