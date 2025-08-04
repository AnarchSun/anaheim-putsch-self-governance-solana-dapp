// FILE: anchor/scripts/initialize.ts
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { readFileSync } from "fs";
import os from "os";
import {existsSync} from "node:fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import {any} from "zod";

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
const programId = new PublicKey("EMKno4tmR5KgB9L1QqFwfARkjksgdUoFrPDAaCFBCmXa");

console.log("programId:", programId.toBase58());
console.log("provider instanceof AnchorProvider?", true);

const program = new Program(idl, provider);

interface MainParams {
    txSig1?: any;
}

async function main(p0: {}) {
    const payer = wallet.publicKey;
    const [anaheimPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), wallet.publicKey.toBuffer()],
        program.programId
    );

    const existingAccount = await connection.getAccountInfo(anaheimPda);
    if (existingAccount) {
        console.log("Anaheim PDA exists, skipping.");
        return;
    }

    const account = await connection.getAccountInfo(anaheimPda);
    const programId = new PublicKey(idl.metadata.address);

    function setIsInitialized(b: boolean) {
        // TODO ORION
    }

    try {

        // ...
    } catch (err) {
        console.warn("Anaheim program not initialized:", err);
        setIsInitialized(false);
    }

    console.log("exists?", !!account);
    // Capture la signature ici
    const txSig = await program.methods
        .initialize(bump)
        .accounts({
            anaheim: anaheimPda,
            payer,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    console.log("Transaction sent:", txSig);
}

let walletPubkey: undefined | PublicKey = undefined;

function toBuffer(): any {
    return any;
}

const [anaheimPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("anaheim"), wallet.publicKey.toBuffer()],
    programId
);

function setIsInitialized(b: boolean) {

}
console.log("anaheim:", programId.toBase58());
try {
    let anaheim: any;
    anaheim = program.account.isPrototypeOf(anaheimPda);
} catch (err) {
    console.warn("Anaheim program not initialized:", err);
    setIsInitialized(false);
}

console.log("ANAHEIM PDA:", anaheimPda.toBase58());


main({}).catch(console.error);
