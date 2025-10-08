// src/lib/nfts/nftCandyMachine.ts

import {
    Metaplex,
    keypairIdentity,
    CandyMachineV2,
} from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

// Connexion à Solana
const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

// Wallet depuis secret key locale (dev)
const wallet = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.WALLET_SECRET || "[]"))
);

function bundlrStorage(_param: { address: string; providerUrl: string; timeout: number }) {
    // TODO ORION
    return undefined;
}

// Initialise Metaplex avec identity et Bundlr
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: process.env.NEXT_PUBLIC_SOLANA_RPC || "",
        timeout: 60000
    }) as any); // cast temporaire pour TS


// Fetch un Candy Machine existant
export async function getCandyMachine(
    candyMachineId: string
): Promise<CandyMachineV2 | null> {
    try {
        const pubkey = new PublicKey(candyMachineId);
        return await metaplex.candyMachinesV2().findByAddress({ address: pubkey });
    } catch (e) {
        console.error("Erreur getCandyMachine:", e);
        return null;
    }
}

// Mint un NFT depuis un Candy Machine
// src/lib/nfts/nftCandyMachine.ts
export async function mintFromCandyMachine(
    candyMachineId: string
): Promise<string | null> {   // ✅ return type explicite
    try {
        const candyMachine = await getCandyMachine(candyMachineId);
        if (!candyMachine) throw new Error("Candy Machine introuvable");

        const { nft } = await metaplex.candyMachinesV2().mint({ candyMachine });

        console.log("Mint OK:", nft.address.toBase58());
        return nft.address.toBase58();
    } catch (e) {
        console.error("Erreur mint:", e);
        return null;   // ✅ renvoie null en cas d'erreur
    }
}

// TODO Worker hooks :
// - Vérifier si Candy Machine est sold out
// - Ajouter auto-update de `TODO.md` quand un mint échoue ou réussit
// - Tenir un log historique pour worker: `data/fixes.json`
// - Générer patch auto pour erreurs récurrentes
