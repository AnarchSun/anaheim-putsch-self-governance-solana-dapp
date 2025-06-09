import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorError } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import type { Anaheim } from '../target/types/anaheim';

describe('anaheim', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.Anaheim as Program<Anaheim>;

  let anaheimKeypair: Keypair;

  const fetchAndExpectCount = async (expectedCount: number) => {
    const acc = await program.account.anaheimAccount.fetch(anaheimKeypair.publicKey);
    expect(acc.count).toEqual(expectedCount);
  };

  beforeEach(async () => {
    anaheimKeypair = Keypair.generate();

    await program.methods.initialize()
      .accounts({
        anaheim: anaheimKeypair.publicKey,
        payer: payer.publicKey,
        // systemProgram: SystemProgram.programId, // <-- NE PAS INCLURE ICI
      })
      .signers([anaheimKeypair])
      .rpc();
  });

  it('initializes Anaheim counter to 0', async () => {
    await fetchAndExpectCount(0);
  });

  it('increments Anaheim counter', async () => {
    await program.methods.increment()
      .accounts({ anaheim: anaheimKeypair.publicKey })
      .rpc();
    await fetchAndExpectCount(1);
  });

  it('decrements Anaheim counter', async () => {
    await program.methods.increment()
      .accounts({ anaheim: anaheimKeypair.publicKey })
      .rpc();
    await program.methods.decrement()
      .accounts({ anaheim: anaheimKeypair.publicKey })
      .rpc();
    await fetchAndExpectCount(0);
  });

  it('sets Anaheim counter to a specific value', async () => {
    await program.methods.set(42)
      .accounts({ anaheim: anaheimKeypair.publicKey })
      .rpc();
    await fetchAndExpectCount(42);
  });

  it('closes the Anaheim account', async () => {
    await program.methods.close()
      .accounts({
        anaheim: anaheimKeypair.publicKey,
        payer: payer.publicKey,
      })
      .rpc();

    const accountInfo = await program.account.anaheimAccount.fetchNullable(anaheimKeypair.publicKey);
    expect(accountInfo).toBeNull();
  });

  it('fails to create post with too long content', async () => {
    const tooLongContent = 'x'.repeat(300);
    const postKeypair = Keypair.generate();

    try {
      await program.methods.createPost(tooLongContent)
        .accounts({ /* ... */ })
        .signers([postKeypair])
        .rpc();

      // Cette erreur doit être levée si la promesse ne rejette pas
      throw new Error('Expected createPost to fail but it succeeded');
    } catch (err: unknown) {
      // Gestion spécifique de l'erreur attendue
      const anchorErr = err as AnchorError;
      if (anchorErr.error?.errorCode?.code === "ContentTooLong") {
        expect(anchorErr.error.errorCode.code).toBe('ContentTooLong');
      } else {
        // Pour les autres erreurs, on remonte
        throw err;
      }
    }

  });

  it('initializes, increments, and closes cleanly', async () => {
    const localKey = Keypair.generate();

    await program.methods.initialize()
      .accounts({
        anaheim: localKey.publicKey,
        payer: payer.publicKey,
        // systemProgram: SystemProgram.programId, // <-- NE PAS INCLURE
      })
      .signers([localKey])
      .rpc();

    await program.methods.increment()
      .accounts({ anaheim: localKey.publicKey })
      .rpc();

    const result = await program.account.anaheimAccount.fetch(localKey.publicKey);
    expect(result.count).toEqual(1);

    await program.methods.close()
      .accounts({
        anaheim: localKey.publicKey,
        payer: payer.publicKey,
      })
      .rpc();

    const closed = await program.account.anaheimAccount.fetchNullable(localKey.publicKey);
    expect(closed).toBeNull();
  });
});
