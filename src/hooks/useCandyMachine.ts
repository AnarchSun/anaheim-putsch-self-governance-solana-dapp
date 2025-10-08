// src/hooks/useCandyMachine.ts

// src/hooks/useCandyMachine.ts
import { useState, useEffect, useCallback } from "react";
import {getCandyMachine, mintFromCandyMachine} from "@/lib/nfts/nftCandyMachine";

export function useCandyMachine(candyMachineId: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nftAddress, setNftAddress] = useState<string | null>(null);
    const [soldOut, setSoldOut] = useState(false);

    // Vérifie si Candy Machine est sold out
    const checkSoldOut = useCallback(async () => {
        try {
            const candyMachine = await getCandyMachine(candyMachineId);
            if (!candyMachine) {
                setError("Candy Machine introuvable");
                return;
            }
            // Placeholder: remplace par candyMachine.itemsAvailable / itemsRemaining selon Metaplex
            const remaining = (candyMachine as any).itemsRemaining ?? 0;
            setSoldOut(remaining <= 0);
        } catch (e: any) {
            setError(e.message || "Erreur checkSoldOut");
        }
    }, [candyMachineId]);

    // Mint un NFT
    const mint = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const address = await mintFromCandyMachine(candyMachineId);
            if (!address) {
                setError("Mint échoué");
                return;
            }
            setNftAddress(address);
        } catch (e: any) {
            setError(e.message || "Erreur mint");
        } finally {
            setLoading(false);
            // TODO Worker: update TODO.md ou data/fixes.json
        }
    }, [candyMachineId]);

    useEffect(() => {
        checkSoldOut().then(_r => {
            // TODO ORION
        } );
    }, [checkSoldOut]);

    return {
        loading,
        error,
        nftAddress,
        soldOut,
        mint,
        refresh: checkSoldOut,
    };
}
