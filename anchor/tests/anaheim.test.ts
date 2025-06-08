import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, SystemProgram } from '@solana/web3.js';
import type { Anaheim } from '../target/types/anaheim';

describe('anaheim - create post', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.Anaheim as Program<Anaheim>;

  it('fails to create post with too long content', async () => {
    const tooLongContent = 'x'.repeat(300);
    const postKeypair = Keypair.generate();

    try {
      await program.methods.createPost(tooLongContent)
        .accounts({
          postAccount: postKeypair.publicKey,
          user: payer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([postKeypair])
        .rpc();

      console.log(program.idl.instructions.find(i => i.name === 'createPost'));

      throw new Error('Expected createPost to fail but it succeeded');
    } catch (err: any) {
      if (err.error?.errorCode?.code === 'ContentTooLong') {
        expect(err.error.errorCode.code).toBe('ContentTooLong');
      } else {
        console.error('Unexpected error:', err);
        throw err;
      }
    }
  });

  it('creates a valid post', async () => {
    const validContent = 'Hello, decentralization!';
    const postKeypair = Keypair.generate();

    const tooLongContent = 'x'.repeat(300); // Définition claire

    await program.methods.createPost(tooLongContent)
      .accounts({
        postAccount: postKeypair.publicKey, // camelCase strict
        user: payer.publicKey,
        systemProgram: SystemProgram.programId, // camelCase strict
      })
      .signers([postKeypair])
      .rpc();



    const acc = await program.account.postAccount.fetch(postKeypair.publicKey);
    expect(acc.content).toBe(validContent);
  });
});
