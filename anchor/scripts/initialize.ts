// FILE: anchor/scripts/initialize.ts
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { readFileSync } from "fs";
import os from "os";
import {existsSync} from "node:fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IDL_PATH = resolve(__dirname, "../target/idl/anaheim.json");
if (!existsSync(IDL_PATH)) {
    throw new Error(`❌ IDL file not found at ${IDL_PATH}. Make sure you've run 'anchor build' and that the path is correct.`);
}

const WALLET_KEYPATH = resolve(os.homedir(), ".config/solana/id.json");
// Cette version part du dossier du projet exécuté (safe & stable)

const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(WALLET_KEYPATH, "utf-8")))
);
const wallet = new Wallet(keypair);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

const idl = JSON.parse(readFileSync(IDL_PATH, "utf-8"));
if (!idl.metadata?.address) throw new Error("IDL metadata.address missing");
const programIdRaw = idl.metadata?.address ?? "ANAHEiM1111111111111111111111111111111111";
const programId = new PublicKey("EMKno4tmR5KgB9L1QqFwfARkjksgdUoFrPDAaCFBCmXa");

console.log("programId:", programId.toBase58());
console.log("provider instanceof AnchorProvider?", true);
console.log("programId:", programId.toBase58());

const program = new Program(idl, provider);

async function main() {
    const payer = wallet.publicKey;
    const [anaheimPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), payer.toBuffer()],
        program.programId
    );

    const existingAccount = await connection.getAccountInfo(anaheimPda);
    if (existingAccount) {
        console.log("Anaheim PDA exists, skipping.");
        return;
    }

    const txSig = await program.methods
        .initialize(bump)
        .accounts({
            anaheim: anaheimPda,
            payer,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

    console.log("Transaction sent:", txSig);
}

main().catch(console.error);
