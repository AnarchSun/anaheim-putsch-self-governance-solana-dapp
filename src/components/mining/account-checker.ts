import { PublicKey, Connection } from "@solana/web3.js";

const walletPubkey = new PublicKey("<your-wallet-pubkey>");

const [anaheimPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("anaheim"), walletPubkey.toBuffer()],
);

const conn = new Connection("https://api.devnet.solana.com"); // ou localnet
const accountInfo = await conn.getAccountInfo(anaheimPda);

console.log("Anaheim account:", accountInfo ? "Exists" : "Missing");
