// src/utils/interact-with-program.ts
/// <reference types="vitest" />
/// <reference types="vitest" />

import { describe, it, expect } from 'vitest'
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Anaheim } from '../../anchor/target/types/anaheim'

const provider = anchor.AnchorProvider.env()
anchor.setProvider(provider)

const program = anchor.workspace.Anaheim as Program<Anaheim>

describe('Anaheim interact test', () => {
  it('Crée un post', async () => {
    const postAccount = Keypair.generate()
    const user = Keypair.generate()

    // TS2345: The instruction 'initialize' does NOT take any arguments!
    // Remove the 'hello world post' argument so it matches your IDL.
    const tx = await program.methods
        .initialize() // <-- NO ARGUMENTS!
        .accounts({
          anaheimAccount: postAccount.publicKey,
          authority: user.publicKey,
        } as any)
        .signers([user, postAccount])
        .rpc()

    console.log('✅ TX envoyé :', tx)

    // Fetch the account data after transaction
    const accountData = await program.account.anaheimAccount.fetch(postAccount.publicKey)

    // TS2339: 'content' does not exist on your account type!
    // Your account structure is { authority: PublicKey; bump: number; count: BN; }
    // So, assert on the real fields, e.g., authority and count.
    expect(accountData.authority.toBase58()).toBe(user.publicKey.toBase58())
    expect(accountData.count.toNumber()).toBe(0) // initial count if your program starts at 0
  })
})