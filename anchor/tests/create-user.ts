import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { describe, it, expect } from "vitest";
import { Anaheim } from "../target/types/anaheim"; // Remplace par le bon nom

describe("create_user", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.YourProgram as Program<Anaheim>;

  it("Fails on empty username", async () => {
    const [userAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .createUser("   ") // Nom invalide
        .accounts({
          user: userAccount,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
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

    const [userAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createUser(validUsername)
      .accounts({
        user: userAccount,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const user = await program.account.user.fetch(userAccount);
    expect(user.username).toBe(validUsername);
  });
});
