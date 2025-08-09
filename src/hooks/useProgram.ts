// src/hooks/useProgram.ts
import { useMemo } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Anaheim } from '@/../anchor/target/types/anaheim';
import IDL from '@/lib/idl/anaheim.json';
// The ANAHEIM_PROGRAM_ID is no longer needed for initialization
// but might be useful elsewhere. We remove it from here for clarity.
// import { ANAHEIM_PROGRAM_ID } from '@/lib/anaheim-program';

export function useAnaheimProgram(): { program: Program<Anaheim> | null, provider: AnchorProvider | null } {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = useMemo(() => {
        // The provider needs a wallet that can sign transactions.
        if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
            return null;
        }
        // The `wallet as any` cast is a common workaround for type differences
        // between wallet-adapter and Anchor's expected wallet interface.
        return new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;

        // ✅ FIX: Use the modern, two-argument constructor.
        // Anchor will get the program ID from the provided IDL file.
        return new Program<Anaheim>(IDL as any, provider);

    }, [provider]);

    return { program, provider };
}