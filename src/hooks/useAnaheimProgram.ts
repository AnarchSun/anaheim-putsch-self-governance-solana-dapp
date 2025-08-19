// src/hooks/useAnaheimProgram.ts
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Program, AnchorProvider, Idl, web3 } from '@coral-xyz/anchor';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../../anchor/target/idl/anaheim.json'; // ✅ Path to auto-generated IDL
import { Anaheim } from '@/types/anaheim';

const network = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';
const programId = new PublicKey('DWiMeBh6xzNMCZq5eW7u67NRNaCkvGaQczcJSzpF5mC9');

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
        return new Program<Anaheim>(idl as Idl, provider);
    }, [provider]);

    useEffect(() => {
        if (connected && publicKey && program) {
            console.log(`✅ Program loaded for wallet ${publicKey.toBase58()}`);
            setIsProgramReady(true);
        } else {
            console.log('⏳ Waiting for wallet connection & program...');
            setIsProgramReady(false);
        }
    }, [connected, publicKey, program]);

    return { program, provider, programId, isProgramReady };
}
