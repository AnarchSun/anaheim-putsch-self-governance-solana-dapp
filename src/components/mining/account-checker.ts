import { PublicKey, Connection } from "@solana/web3.js";

// L'adresse de votre programme, pas d'un portefeuille !
const programId = new PublicKey("83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB");

// L'adresse du portefeuille qui est utilisé comme seed
const walletPubkey = new PublicKey("8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX");

// ✅ FIX: On ajoute le 'programId' comme deuxième argument.
const [anaheimPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("anaheim"), walletPubkey.toBuffer()],
    programId
);

async function checkAccount() {
    const conn = new Connection("https://api.devnet.solana.com");
    // FIX: getAccountInfo attends un PublicKey, PAS un objet.
    const accountInfo = await conn.getAccountInfo(anaheimPda);
    console.log("Adresse PDA vérifiée:", anaheimPda.toBase58());
    console.log("Le compte Anaheim existe-t-il ?:", accountInfo ? "Oui" : "Non");
}

checkAccount();