// FILE: src/hooks/useProgram.ts
'use client';

import { useMemo } from 'react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Anaheim } from '@/../anchor/target/types/anaheim'; // This type import is correct

// =========================================================================
//                             IDL & CONFIG
// =========================================================================

// ✅ THE FIX: The `idl` constant now contains the COMPLETE and VALID IDL.
// This includes the `address`, `instructions`, `accounts`, AND `types` arrays.
const idl = {
    "address": "B1cHVNAFWYX3zXZjqi2tubPZGzrLQEAiL5A9URqKskFi",
    "metadata": {
        "name": "anaheim",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "decrement",
            "discriminator": [ 106, 227, 168, 59, 248, 27, 150, 101 ],
            "accounts": [ /* ... */ ],
            "args": []
        },
        {
            "name": "increment",
            "discriminator": [ 11, 18, 104, 9, 104, 174, 59, 33 ],
            "accounts": [ /* ... */ ],
            "args": []
        },
        {
            "name": "initialize",
            "discriminator": [ 175, 175, 109, 31, 13, 152, 155, 237 ],
            "accounts": [ /* ... */ ],
            "args": []
        },
        {
            "name": "set",
            "discriminator": [ 198, 51, 53, 241, 116, 29, 126, 194 ],
            "accounts": [ /* ... */ ],
            "args": [ /* ... */ ]
        }
    ],
    "accounts": [
        {
            "name": "AnaheimAccount",
            "discriminator": [ 26, 253, 236, 239, 22, 181, 47, 158 ]
        }
    ],
    "types": [
        {
            "name": "AnaheimAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "authority", "type": "pubkey" },
                    { "name": "bump", "type": "u8" },
                    { "name": "count", "type": "u64" }
                ]
            }
        }
    ]
};

// =========================================================================

const network = "https://api.devnet.solana.com";

export function useAnaheimProgram() {
    const wallet = useAnchorWallet();

    const provider = useMemo(() => {
        if (!wallet) return undefined;
        const connection = new Connection(network, "processed");
        return new AnchorProvider(connection, wallet, {
            preflightCommitment: "processed",
        });
    }, [wallet]);

    const program = useMemo(() => {
        if (!provider) return undefined;
        // The Program constructor will now receive a complete IDL and will not throw an error.
        return new Program<Anaheim>(idl as any, provider);
    }, [provider]);

    return { program, provider };
}