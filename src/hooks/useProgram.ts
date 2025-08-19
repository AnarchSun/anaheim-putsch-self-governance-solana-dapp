// FILE: src/hooks/useProgram.ts
'use client';

import { useMemo } from 'react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

// ✅ BEST PRACTICE: Import the generated types and the IDL JSON directly.
// This requires a symlink or a correct relative path to your anchor project.
import { Anaheim } from '../../anchor/target/types/anaheim';
import idlJson from '../../anchor/target/idl/anaheim.json';

// --- CONFIGURATION (at the top level, no hooks) ---

const network = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://api.devnet.solana.com";

// We cast the imported JSON to the Idl type once. This is safe.
const idl = idlJson as Idl;

// We create the PublicKey object from the address within the JSON file.
const programId = new PublicKey(idlJson.address);


// --- THE CUSTOM HOOK (all hook calls are now INSIDE this function) ---

export function useAnaheimProgram() {
    // 1. Call the wallet hook INSIDE our custom hook.
    const wallet = useAnchorWallet();

    // 2. Create the provider using useMemo, INSIDE our custom hook.
    const provider = useMemo(() => {
        if (!wallet) return undefined;
        const connection = new Connection(network, "processed");
        return new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
    }, [wallet]);

    // 3. Create the program instance using useMemo, INSIDE our custom hook.
    const program = useMemo(() => {
        if (!provider) return undefined;
        try {
            // Use the modern, explicit, three-argument constructor for full type safety.
            return new Program<Anaheim>(idl, provider);
        } catch (error) {
            console.error("🔥 FATAL ERROR creating Program instance:", error);
            return undefined;
        }
    }, [provider]);

    // 4. Return the memoized values.
    return { program, provider,  programId };
}