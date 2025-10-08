// src/hooks/useCandyMachine.ts
import { useState } from "react";
import {mintFromCandyMachine} from "@/lib/nfts/nftCandyMachine";

export default function useCandyMachine(candyMachineId: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nftAddress, setNftAddress] = useState<string | null>(null);

    const mint = async (): Promise<string | null> => {
        setLoading(true);
        setError(null);

        try {
            const address = await mintFromCandyMachine(candyMachineId);
            if (!address) throw new Error("Mint échoué");
            setNftAddress(address);
            return address; // ✅ retourne bien string
        } catch (e: any) {
            setError(e.message || "Erreur inconnue");
            return null; // ✅ retourne null en cas d'erreur
        } finally {
            setLoading(false);
        }
    };

    return { mint, loading, error, nftAddress };
}
