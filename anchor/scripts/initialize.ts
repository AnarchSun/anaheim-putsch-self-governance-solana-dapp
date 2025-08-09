// FILE: anchor/scripts/initialize.ts
// VERSION FINALE ET CORRECTE

import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { readFileSync, existsSync } from "fs";
import os from "os";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// --- SETUP INITIAL ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IDL_PATH = resolve(__dirname, "..", "target", "idl", "anaheim.json");
if (!existsSync(IDL_PATH)) {
    throw new Error(`❌ Fichier IDL non trouvé. Exécutez 'anchor build'.`);
}
const idl = JSON.parse(readFileSync(IDL_PATH, "utf-8"));

const WALLET_KEYPATH = resolve(os.homedir(), ".config", "solana", "id.json");
if (!existsSync(WALLET_KEYPATH)) {
    throw new Error(`❌ Fichier de portefeuille local non trouvé.`);
}
const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(WALLET_KEYPATH, "utf-8")))
);
const wallet = new Wallet(keypair);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

// ✅ FIX: L'adresse est à la racine de l'IDL, pas dans metadata.
const programId = new PublicKey(idl.address);
const program = new Program(idl, provider);

console.log(`Script d'initialisation pour le programme : ${programId.toBase58()}`);
console.log(`Utilisation du portefeuille : ${wallet.publicKey.toBase58()}`);


// --- FONCTION PRINCIPALE ---
async function main() {
    // Les seeds doivent correspondre à votre programme Rust. L'IDL indique que le 'payer' en fait partie.
    const [anaheimPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), wallet.publicKey.toBuffer()],
        program.programId
    );

    console.log("Adresse du PDA calculée :", anaheimPda.toBase58());

    const existingAccount = await connection.getAccountInfo(anaheimPda);
    if (existingAccount) {
        console.log("✅ Le compte programme existe déjà. Aucune action n'est nécessaire.");
        return;
    }

    console.log("Le compte n'existe pas. Envoi de la transaction d'initialisation...");

    const txSignature = await program.methods
        .initialize(bump)
        .accounts({
            // Le nom du compte dans l'IDL est "anaheim".
            anaheim: anaheimPda,
            payer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair]) // Le payeur local doit signer la transaction
        .rpc();

    console.log("🚀 Transaction envoyée avec succès !");
    console.log(`Lien vers l'explorateur : https://explorer.solana.com/tx/${txSignature}?cluster=devnet`);
}

// --- EXÉCUTION DU SCRIPT ---
main().catch(err => {
    console.error("❌ Échec de l'initialisation :", err);
    process.exit(1);
});