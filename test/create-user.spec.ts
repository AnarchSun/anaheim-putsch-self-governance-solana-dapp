import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { describe, it, expect } from "vitest";

// IMPORTANT : importe le type généré par Anchor (chemin relatif à ajuster)
import { Anaheim } from "../anchor/target/types/anaheim";


// Initialise Anchor provider une seule fois
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Instancie le programme une seule fois (évite redeclare)
const program = anchor.workspace.Anaheim as Program<Anaheim>;

describe("🔐 createUser", () => {
  it("should create a user account with correct authority and bump", async () => {
    const user = Keypair.generate();

    const [userPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createUser("alice")
      .accounts({
        userAccount: userPda,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const account = await program.account.userAccount.fetch(userPda);

    const stored = Buffer.from(account.username as Buffer)
      .toString()
      .replace(/\0+$/, "");

    expect(stored).toBe("alice");
    expect(account.authority.toBase58()).toBe(user.publicKey.toBase58());
    expect(account.bump).toBe(bump);
  });
});
