import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { SystemProgram } from '../../node_modules/@solana/web3.js'
import { describe, it, expect } from 'vitest'

describe('Create User', () => {
  it('Initializes a user account', async () => {
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.Anaheim as Program

    const userKeypair = anchor.web3.Keypair.generate()

    await program.methods
      .createUser('username')
      .accounts({
        user: userKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([userKeypair])
      .rpc()

    const userAccount = await program.account.userAccount.fetch(userKeypair.publicKey)
    expect(userAccount.username).toBe('username')
  })
})
