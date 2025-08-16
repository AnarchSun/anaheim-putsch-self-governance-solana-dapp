// FILE: src/hooks/useProgram.ts
'use client';

import { useMemo } from 'react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

// ✅ BEST PRACTICE: Import the generated types and IDL directly.
// This requires a symlink or correct relative path to your anchor project.
import { Anaheim } from '../../anchor/target/types/anaheim';
import idlJson from '../../anchor/target/idl/anaheim.json';

// --- CONFIGURATION ---

const network = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://api.devnet.solana.com";

// We cast the imported JSON to the Idl type once.
const idl = idlJson as Idl;
// We create the PublicKey object from the address in the IDL.
const programId = new PublicKey(idl.address);


// --- THE CUSTOM HOOK ---

export function useAnaheimProgram() {
    const wallet = useAnchorWallet();

    const provider = useMemo(() => {
        if (!wallet) return undefined;
        const connection = new Connection(network, "processed");
        return new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
    }, [wallet]);

    const program = useMemo(() => {
        if (!provider) return undefined;
        try {
            // ✅ THE FIX: Use the modern, three-argument constructor for full type safety.
            // This is the source of all the previous runtime errors.
            return new Program<Anaheim>(idl, provider);
        } catch (error) {
            console.error("🔥 FATAL ERROR creating Program instance:", error);
            return undefined;
        }
    }, [provider, programId]);

    return { program, provider };
}