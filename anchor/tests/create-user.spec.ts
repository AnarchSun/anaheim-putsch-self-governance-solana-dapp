import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { describe, it, expect } from "vitest";
import { Anaheim } from "../target/types/anaheim";

describe("create_user", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.anaheim as Program<Anaheim>;

  it("Fails on empty username", async () => {
    const [user_account] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      const [userAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), provider.wallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .createUser("Alice")
        .accounts({
          user: provider.wallet.publicKey,
          userAccount,          // ⚡ exact camelCase du IDL
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      throw new Error("Expected failure but succeeded");
    } catch (error) {
      const expectedCode = "InvalidContent";
      if (error instanceof anchor.AnchorError) {
        expect(error.error.errorCode.code).toBe(expectedCode);
      } else {
        throw new Error(`Unexpected error type: ${error}`);
      }
    }
  });


  it("Creates a user successfully with a valid username", async () => {
    const validUsername = "Alice";

    const [user_account] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createUser(validUsername)
      .accounts({
        user: provider.wallet.publicKey,
        user_account, // ✅ must match Rust: `pub user_account`
        system_program: SystemProgram.programId,
      })
      .rpc();

    const user = await program.account.userAccount.fetch(user_account);
    expect(user.username).toBe(validUsername);
  });
});
