// FILE: src/components/mining/account-checker.ts
import { PublicKey, Connection } from "@solana/web3.js";

// L'adresse de votre programme, pas d'un portefeuille !
const programId = new PublicKey("EMKno4tmR5KgB9L1QqFwfARkjksgdUoFrPDAaCFBCmXa");

// L'adresse du portefeuille qui est utilisé comme seed
const walletPubkey = new PublicKey("METTEZ_ICI_L_ADRESSE_DU_PORTEFEUILLE_UTILISATEUR");

// ✅ FIX: On ajoute le 'programId' comme deuxième argument.
const [anaheimPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("anaheim"), walletPubkey.toBuffer()],
    programId
);

async function checkAccount() {
    const conn = new Connection("https://api.devnet.solana.com");
    const accountInfo = await conn.getAccountInfo(anaheimPda);
    console.log("Adresse PDA vérifiée:", anaheimPda.toBase58());
    console.log("Le compte Anaheim existe-t-il ?:", accountInfo ? "Oui" : "Non");
}

checkAccount();