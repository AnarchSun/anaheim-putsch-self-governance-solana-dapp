// FILE: src/hooks/useAnaheimProgram.ts

import { useMemo } from 'react';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import IDL from '@/../anchor/target/idl/anaheim.json';
import { Anaheim } from '@/../anchor/target/types/anaheim';

export function useAnaheimProgram() {
    const { connection } = useConnection();
    const wallet = useWallet();

    // ⚠️ Le programmeId du saint graal, clé de la vérité
    const programId = useMemo(() => new PublicKey('EMKno4tmR5KgB9L1QqFwfARkjksgdUoFrPDAaCFBCmXa'), []);

    // Le provider est l’autel où se tient la magie des transactions
    const provider = useMemo(() => {
        if (
            !wallet.publicKey ||
            !wallet.signTransaction ||
            !wallet.signAllTransactions
        ) return null;

        return new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
    }, [connection, wallet]);

    // Le programme est l’esprit, qui écoute l’autel et comprend l’IDL
    const program = useMemo(() => {
        if (!provider) return null;
        return new Program<Anaheim>(IDL as unknown as Idl, provider);
    }, [provider, programId]);

    // ✨ Retourne le duo sacré, l’instrument et son canal
    return { program, provider };
}
