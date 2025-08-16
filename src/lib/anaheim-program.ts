// src/lib/anaheim-program.ts
'use client';

import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import idlJson from '../../anchor/target/idl/anaheim.json';

export function useAnaheimProgram(programId: any) {
    const wallet = useAnchorWallet();

    const provider = useMemo(() => {
        if (!wallet) return undefined;
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com', 'processed');
        return new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    }, [wallet]);

    const program = useMemo(() => {
        if (!provider) return undefined;

        // Prefer the ID from the IDL if present, else fall back to env
        const idFromIdl = (idlJson as any)?.address as string | undefined;
        const idFromEnv = process.env.NEXT_PUBLIC_ANAHEIM_PROGRAM_ID;

        const pidStr = idFromIdl || idFromEnv;
        if (!pidStr) {
            console.error('Missing program id. Set idl.address or NEXT_PUBLIC_ANAHEIM_PROGRAM_ID.');
            return undefined;
        }

        const programId = new PublicKey(pidStr);
        return new Program(idlJson as Idl, provider);
    }, [provider, programId]);

    return { program, provider };
}
