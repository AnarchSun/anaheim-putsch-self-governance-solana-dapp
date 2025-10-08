// FILE: src/hooks/useAnaheimProgram.ts
import { useMemo } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import IDL from '@/lib/idl/anaheim.json';
import { Anaheim } from '@/../anchor/target/types/anaheim';
import { ANAHEIM_PROGRAM_ID } from '@/lib/anaheim-program';
import { PublicKey } from '@solana/web3.js';

export function useAnaheimProgram() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = useMemo(() => {
        if (!wallet.publicKey || !wallet.signTransaction) return null;
        return new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program<Anaheim>(
            IDL as any,
            new PublicKey(ANAHEIM_PROGRAM_ID), // S'assurer que c'est bien un PublicKey
            provider
        );
    }, [provider]);

    return { program, provider };
}
