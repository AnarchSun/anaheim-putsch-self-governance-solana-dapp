import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { describe, it, expect } from "vitest";
import { Anaheim } from "../target/types/anaheim";

describe("create_user", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.anaheim as Program<Anaheim>;

  it("Creates a user successfully with a valid username", async () => {
    const validUsername = "Alice";

    // 1. Trouver la PDA avec la même casse que l'IDL : userAccount
    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // 2. Appeler la méthode avec la clé userAccount (camelCase)
    const accounts = {
      userAccount, // Ou user_account selon le cas
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    };

// Forcer le typage pour voir les erreurs
    const typedAccounts: CreateUserAccounts = accounts;

  .rpc();

    // 3. Fetcher l'account avec la même variable userAccount
    const user = await program.account.userAccount.fetch(userAccount);
    expect(user.username).toBe(validUsername);
  });
});
