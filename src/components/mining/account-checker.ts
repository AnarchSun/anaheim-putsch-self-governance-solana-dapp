// PATH: src/components/mining/account-checker.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Imports network, cluster, programId, and walletPubkey from config, TypeScript strict, filename/path éternel, punk comments, matrix override!

import { PublicKey, Connection, AccountInfo } from "@solana/web3.js";
// PATCH: Import all network, cluster, programId, AND walletPubkey constants from config
import {
    SOLANA_CLUSTER_URL,
    PROGRAM_ID,
    CLUSTER,
    WALLET_PUBKEY, // <-- WALLET_PUBKEY imported!
} from "@/config/solana";

// PATCH: Use imported programId as PublicKey instance
const programId = new PublicKey(PROGRAM_ID);

// PATCH: Use imported walletPubkey as PublicKey instance
const walletPubkey = WALLET_PUBKEY;

// ✅ FIX: On ajoute le 'programId' comme deuxième argument.
const [anaheimPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("anaheim"), walletPubkey.toBuffer()],
    programId
);

async function checkAccount(): Promise<void> {
    // PATCH: Use imported endpoint (prefer SOLANA_CLUSTER_URL or SOLANA_RPC_ENDPOINT)
    const conn = new Connection(SOLANA_CLUSTER_URL);

    // getAccountInfo attends un PublicKey, PAS un objet.
    const accountInfo: AccountInfo<Buffer> | null = await conn.getAccountInfo(anaheimPda);

    console.log("Cluster utilisé :", CLUSTER);
    console.log("Programme ID utilisé :", programId.toBase58());
    console.log("Wallet utilisé :", walletPubkey.toBase58());
    console.log("RPC Endpoint utilisé :", SOLANA_CLUSTER_URL);
    console.log("Adresse PDA vérifiée :", anaheimPda.toBase58());
    console.log("Le compte Anaheim existe-t-il ? :", accountInfo ? "Oui" : "Non");
}

// PATCH: Run as Node script, or export if you want to use it elsewhere (React/UI)
checkAccount().then(() =>{} );

// PATCH NOTES:
// - Imports network, cluster, programId, and walletPubkey from config as constants
// - TypeScript strict, filename/path éternel, batch fix grunge
// - Zéro mirage, matrix hacked, punk as fuck!