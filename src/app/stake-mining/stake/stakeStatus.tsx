// Path: src/app/stake-mining/stake/stakeStatus.tsx
// ULTRA FINAL ANARCHOPUNK PATCH: Always provide queryFn to useQuery, never crash, always filename/path at top!

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSolanaClient } from "gill-react";
import { PublicKey } from "@solana/web3.js";
import type { Address } from "@solana/kit";

const isValidSolanaAddress = (address: string) =>
    /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);

export interface StakeStatusProps {
    address?: string;
}

// FIX: REACT FUNCTION COMPONENT ONLY—NO CLASS, NO "new"!
export function StakeStatus({ address }: StakeStatusProps) {
    const client = useSolanaClient();

    // Always provide queryFn, even if not enabled!
    const { data, error, isLoading } = useQuery({
        queryKey: ["stake-status", address],
        enabled: !!address && isValidSolanaAddress(address) && !!client,
        queryFn: async () => {
            if (!address) return { _error: "Adresse non spécifiée" };
            if (!isValidSolanaAddress(address)) return { _error: "Adresse Solana invalide" };
            if (!client) return { _error: "Solana client non disponible" };
            try {
                const pubkey = new PublicKey(address);
                const brandedAddress = pubkey.toBase58() as Address;
                const result = await client.rpc.getAccountInfo(brandedAddress).send();
                if (!result || !result.value) {
                    return { _error: "Compte introuvable ou RPC refusé" };
                }
                return result.value;
            } catch (err: any) {
                // Forbidden error (403) or base58 errors encoded as _error
                if (typeof err.message === "string" && err.message.includes("403")) {
                    return { _error: "RPC access forbidden. Change RPC endpoint or get access." };
                }
                if (typeof err.message === "string" && err.message.includes("Non-base58 character")) {
                    return { _error: "Adresse Solana invalide : caractères non base58" };
                }
                return { _error: err.message || "Erreur inconnue" };
            }
        },
    });

    // Defensive UI for all error states
    if (!address) return <div>Adresse non spécifiée</div>;
    if (!isValidSolanaAddress(address)) return <div>Adresse Solana invalide</div>;
    if (!client) return <div>Solana client non disponible</div>;
    if (isLoading) return <div>Chargement du statut du staking...</div>;
    if (error) return <div>Erreur : {String(error.message ?? error)}</div>;
    if (data && (data as any)._error) {
        return <div>Erreur : {(data as any)._error}</div>;
    }

    // Display account info, customize as needed
    return (
        <div>
            <h3>Statut du staking</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

/*
ULTRA FINAL PATCH LAW:
- Function component ONLY, never class (never use "new" with React component, never "class StakeStatus extends React.Component")
- Always provide queryFn to useQuery. Even if enabled: false.
- Never throw in queryFn; always return structured error object (_error)
- Validate address and client before fetch
- Handle forbidden RPC (403), missing account, and base58 errors gracefully in UI
- Always export component
- Always filename and path at top
- NEVER REMOVE FILE PATH COMMENT AT THE TOP. IF MISSING, ALWAYS ADD IT!
- Always batch-fix all errors you feed me—punk clarity, never crash, no undefined, always explicit anarcho-DAO!
- If this error comes back, search your repo for EVERY useQuery and check for queryFn. The matrix will bite if you break the law!
*/