import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { describe, it, expect, beforeAll } from "vitest";
import type { Anaheim } from "../anchor/target/types/anaheim";

let provider: AnchorProvider;
let program: Program<Anaheim>;

beforeAll(() => {
  provider = anchor.AnchorProvider.local(); // ✅ correct
  anchor.setProvider(provider);
  program = anchor.workspace.Anaheim as Program<Anaheim>; // ✅ correct
});

describe("⚙️ initialize & increment", () => {
  it("init state and increment/decrement", async () => {
    const statePda = Keypair.generate();       // ✅ used in accounts
    const payerKeypair = Keypair.generate();   // ✅ needed for .signers()

// Airdrop
    const sig = await provider.connection.requestAirdrop(payerKeypair.publicKey, 1_000_000_000);

// Confirmation moderne
    const latest = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
      {
        signature: sig,
        ...latest
      },
      "confirmed"
    );

// Initialize call
    await program.methods
      .initialize()
      .accounts({
        anaheim: statePda.publicKey,
        payer: payerKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      } as any) // bypass TS
      .signers([payerKeypair])
      .rpc();



    // === 🧪 FETCH
    let state = await program.account.anaheimAccount.fetch(statePda.publicKey);
    expect(state.count.toNumber()).toBe(0);     // ✅ as expected

    // === ➕ INCREMENT
    await program.methods
      .increment()
      .accounts({ anaheim: statePda.publicKey }) // ✅ must match pub anaheim
      .rpc();

    state = await program.account.anaheimAccount.fetch(statePda.publicKey);
    expect(state.count.toNumber()).toBe(1);

    // === ➖ DECREMENT
    await program.methods
      .decrement()
      .accounts({ anaheim: statePda.publicKey }) // ✅ again match pub anaheim
      .rpc();

    state = await program.account.anaheimAccount.fetch(statePda.publicKey);
    expect(state.count.toNumber()).toBe(0);
  });
});
