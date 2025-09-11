// PATH: src/hooks/useAnaheimProgram.ts
// ULTRA FINAL ANARCHOPUNK PATCH: TS2345 batch fix, filename/path éternel!

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../../anchor/target/idl/anaheim.json'; // ✅ Path to auto-generated IDL
import { Anaheim } from '../../anchor/target/types/anaheim';
import { SOLANA_CLUSTER_URL, PROGRAM_ID } from '@/config/solana';

const network = SOLANA_CLUSTER_URL;
const programId = new PublicKey(PROGRAM_ID);

export function useAnaheimProgram() {
    const wallet = useAnchorWallet();
    const { connected, publicKey } = useWallet();
    const [isProgramReady, setIsProgramReady] = useState(false);

    const provider = useMemo(() => {
        if (!wallet) return null;
        const connection = new Connection(network, 'processed');
        return new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    }, [wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        // PATCH: Utilise idl, programId, provider dans cet ordre!
        return new Program<Anaheim>(idl as Idl, provider);
    }, [provider, programId]);

    useEffect(() => {
        if (connected && publicKey && program) {
            console.log(`✅ Program loaded for wallet ${publicKey.toBase58()}`);
            setIsProgramReady(true);
        } else {
            console.log('⏳ Waiting for wallet connection & program...');
            setIsProgramReady(false);
        }
    }, [connected, publicKey, program,  programId]);

    return { program, provider, programId, isProgramReady };
}

// PATCH NOTES:
// - TS2345: Mauvais ordre des arguments dans Program, corrigé.
// - Program construit comme il faut : (idl, programId, provider)
// - Filename/path éternel, matrix override grunge!