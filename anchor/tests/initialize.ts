// FILE: anchor/tests/initialize.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Anaheim } from "../target/types/anaheim";

// This is an IIFE (Immediately Invoked Function Expression)
// It allows us to use async/await at the top level of a script.
(async () => {
    try {
        const provider = anchor.AnchorProvider.env();
        anchor.setProvider(provider);

        const program = anchor.workspace.Anaheim as Program<Anaheim>;
        const anaheimAccount = anchor.web3.Keypair.generate();

        console.log("Attempting to initialize program on Devnet...");

        // FIX: The `systemProgram` is removed from the .accounts() call.
        // The TypeScript error (TS2353) tells us this property is not expected.
        // Anchor will add it implicitly when it builds the transaction.
        const tx = await program.methods
            .initialize()
            .accounts({
                anaheim: anaheimAccount.publicKey,
                payer: provider.wallet.publicKey,
            })
            .signers([anaheimAccount])
            .rpc();

        console.log("Your transaction signature", tx);
        console.log("================================================================");
        console.log("PROGRAM INITIALIZED SUCCESSFULLY!");
        console.log("Your Anaheim Account Public Key is:", anaheimAccount.publicKey.toBase58());
        console.log("================================================================");
        console.log("COPY THIS PUBLIC KEY AND PASTE IT INTO YOUR FRONTEND CODE.");
        console.log("Location: src/lib/anaheim-program.ts -> ANAHEIM_ACCOUNT_PUBKEY");

    } catch (err) {
        console.error("Initialization failed:", err);
    }
})();