// FILE: anchor/scripts/initialize.ts
import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { Anaheim } from "../target/types/anaheim";
import { resolve, dirname } from "path";
import { readFileSync } from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helpers
function loadJson(jsonPath: string): any {
    return JSON.parse(readFileSync(jsonPath, "utf-8"));
}

function loadKeypair(keypairPath: string): web3.Keypair {
    const keypairData = loadJson(keypairPath);
    return web3.Keypair.fromSecretKey(new Uint8Array(keypairData));
}

// Constants
const IDL_PATH = resolve(__dirname, "../target/idl/anaheim.json");
const WALLET_KEYPATH = resolve(os.homedir(), ".config/solana/id.json");

const idl = loadJson(IDL_PATH);
const walletKeypair = loadKeypair(WALLET_KEYPATH);
const wallet = new Wallet(walletKeypair);
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
});

// Declare the program properly AFTER idl/provider exists
const program = new Program<Anaheim>(idl as any, idl.metadata.address); // 🧙 Remplace idl.metadata.address par ton vrai programId si absent

async function main() {
    const payer = wallet.publicKey;
    const [anaheimPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), payer.toBuffer()],
        program.programId
    );

    const accountInfo = await connection.getAccountInfo(anaheimPda);
    if (accountInfo !== null) {
        console.log("PDA exists. No action needed.");
        return;
    }

    const tx = await program.methods
        .initialize(bump)          // bump passé à initialize
        .accounts({
            anaheim: anaheimPda,   // doit correspondre exactement au nom dans #[account]
            payer,
            systemProgram: web3.SystemProgram.programId,
        })
        .signers([walletKeypair])
        .rpc();

    console.log("Transaction signature:", tx);
}

main().catch((e) => {
    console.error("Script failed:", e);
    process.exit(1);
});
