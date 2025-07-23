// FILE: anchor/scripts/initialize.ts
import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { Anaheim } from "../target/types/anaheim";
import { resolve } from "path";
import { readFileSync } from "fs";
import os from "os";

// Helper function to load a JSON file from a path.
function loadJson(jsonPath: string): any {
    const fullPath = resolve(jsonPath);
    return JSON.parse(readFileSync(fullPath, "utf-8"));
}

// Helper function to load a keypair from a file path.
function loadKeypair(keypairPath: string): web3.Keypair {
    const keypairData = loadJson(keypairPath);
    return web3.Keypair.fromSecretKey(new Uint8Array(keypairData));
}

async function initialize() {
    // 1. Manually create the Connection.
    const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");

    // 2. Manually load your Payer wallet from its file.
    const walletKeypair = loadKeypair(os.homedir() + "/.config/solana/id.json");
    const wallet = new Wallet(walletKeypair);

    // 3. Manually create the Provider.
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

    // 4. Load the IDL and create the Program instance correctly.
    const idl = loadJson("./anchor/target/idl/anaheim.json");
    const program = new Program<Anaheim>(idl, provider);

    // 5. Load the permanent keypair for the data account we are about to create.
    const anaheimAccount = loadKeypair("./anchor/anaheim-account-key.json");

    console.log("================================================================");
    console.log("Initializing account on Devnet...");
    console.log("Using Program ID:", program.programId.toBase58());
    console.log("Data Account Public Key:", anaheimAccount.publicKey.toBase58());
    console.log("================================================================");

    // Check if the account already exists on Devnet.
    const accountInfo = await provider.connection.getAccountInfo(anaheimAccount.publicKey);
    if (accountInfo !== null) {
        console.log("SUCCESS: Account already exists on Devnet. No action needed.");
        return;
    }

    console.log("Account not found on Devnet. Sending initialize transaction...");

    const tx = await program.methods
        .initialize()
        .accounts({
            anaheim: anaheimAccount.publicKey,
            payer: provider.wallet.publicKey,
        })
        .signers([anaheimAccount])
        .rpc();

    console.log("Transaction successful with signature:", tx);
    console.log("SUCCESS: Account has been initialized on Devnet.");
}

initialize().then(
    () => console.log('Script finished successfully.'),
    (err) => {
        console.error('Script failed:', err);
        process.exit(1);
    }
);