import { useMemo } from 'react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

import { Anaheim } from '../../anchor/target/types/anaheim';
import idlJson from '../../anchor/target/idl/anaheim.json';
import { SOLANA_CLUSTER_URL, PROGRAM_ID } from '@/config/solana';

const network = SOLANA_CLUSTER_URL;
const programId = new PublicKey(PROGRAM_ID);
const idl = idlJson as Idl;

export function useProgramAnaheim() {
    const wallet = useAnchorWallet();

    const provider = useMemo(() => {
        if (!wallet) return undefined;
        const connection = new Connection(network, 'processed');
        return new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    }, [wallet]);

    const program = useMemo(() => {
        if (!provider) return undefined;
        try {
            return new Program<Anaheim>(idl, provider);
        } catch (error) {
            console.error('🔥 FATAL ERROR creating Program instance:', error);
            return undefined;
        }
    }, [provider]);

    return { program, provider, programId };
}
