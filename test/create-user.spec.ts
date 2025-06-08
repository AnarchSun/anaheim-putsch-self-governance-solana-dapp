// test/create-user.spec.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { describe, it, expect } from "vitest";
import { Anaheim } from "../anchor/target/types/anaheim";

// Initialise Anchor une seule fois
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Anaheim as Program<Anaheim>;

describe("🔐 createUser", () => {
  it("should create a user account with correct authority and bump", async () => {
    // 1) Génère un nouveau wallet
    const user = Keypair.generate();

    // 2) Calcule le PDA de userAccount (version sync)
    const [userPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    );
    console.log("Instructions:", program.idl.instructions.map(i => i.name));
    console.log("Accounts:    ", program.idl.accounts.map(a => a.name));

    // 3) Envoie l’instruction createUser
    await (program.methods as any)["create_user"]("alice")
      .accounts({
        user_account: userPda,     // <-- snake_case
        user:         user.publicKey,
      })
      .signers([user])
      .rpc();

// 4) Récupère le compte on‐chain :
    const account = await (program.account as any)["user_account"].fetch(userPda);


    // 5) Assertions
    //    a) Le username est bien « alice »
    const stored = Buffer.from(account.username as Buffer)
      .toString()
      .replace(/\0+$/, ""); // trim les zéros
    expect(stored).toBe("alice");

    //    b) L’autorité correspond au signer
    expect(account.authority.toBase58()).toBe(user.publicKey.toBase58());

    //    c) Le bump est celui renvoyé par findProgramAddressSync
    expect(account.bump).toBe(bump);
  });
});
