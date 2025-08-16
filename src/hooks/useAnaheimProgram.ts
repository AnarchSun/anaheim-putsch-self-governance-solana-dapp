// FILE: src/hooks/useAnaheimProgram.ts
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Anaheim } from '@/types/anaheim';

// =========================================================================
// IDL & CONFIG
// =========================================================================
const idl: Idl = {
    version: '0.1.0',
    name: 'anaheim',
    address: 'B1cHVNAFWYX3zXZjqi2tubPZGzrLQEAiL5A9URqKskFi',
    instructions: [],
    accounts: [
        {
            name: 'AnaheimAccount',
            discriminator: [],
        },
    ],
    types: [
        {
            name: 'AnaheimAccount',
            type: {
                kind: 'struct',
                fields: [
                    { name: 'authority', type: 'pubkey' },
                    { name: 'bump', type: 'u8' },
                    { name: 'count', type: 'u64' },
                ],
            },
        },
    ],
    errors: [],
} as any as Idl;

const network = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';
const programId = new PublicKey(idl.address);

// =========================================================================
// CUSTOM HOOK
// =========================================================================
export function useAnaheimProgram() {
    const wallet = useAnchorWallet();
    const { connected, publicKey } = useWallet();
    const [isProgramReady, setIsProgramReady] = useState(false);

    // AnchorProvider
    const provider = useMemo(() => {
        if (!wallet) return undefined;
        const connection = new Connection(network, 'processed');
        return new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    }, [wallet]);

    // Program instance
    const program = useMemo(() => {
        if (!provider) return undefined;
        return new Program<Anaheim>(idl, provider);
    }, [provider]);

    // Track readiness
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
