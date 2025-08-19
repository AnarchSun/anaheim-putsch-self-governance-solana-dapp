import { useEffect, useMemo, useState } from 'react';
import {Program, AnchorProvider, Idl} from '@coral-xyz/anchor';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Anaheim } from '@/types/anaheim';

const network = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';
const idl: Idl = {
    address: 'DWiMeBh6xzNMCZq5eW7u67NRNaCkvGaQczcJSzpF5mC9',
    metadata: {
        "name": "anaheim",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
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
};

const programId = new PublicKey(idl.address);

export function useAnaheimProgram() {
    const wallet = useAnchorWallet();
    const { connected, publicKey } = useWallet();
    const [isProgramReady, setIsProgramReady] = useState(false);

    const provider = useMemo(() => {
        if (!wallet) return null;  // ✅ instead of undefined
        const connection = new Connection(network, 'processed');
        return new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    }, [wallet]);

    const program = useMemo(() => {
        if (!provider) return null;  // ✅ instead of undefined
        return new Program<Anaheim>(idl, provider);
    }, [provider]);

    useEffect(() => {
        if (connected && publicKey && program) {  // ✅ program is never void
            console.log(`✅ Program loaded for wallet ${publicKey.toBase58()}`);
            setIsProgramReady(true);
        } else {
            console.log('⏳ Waiting for wallet connection & program...');
            setIsProgramReady(false);
        }
    }, [connected, publicKey, program]);

    return { program, provider, programId, isProgramReady };
}
