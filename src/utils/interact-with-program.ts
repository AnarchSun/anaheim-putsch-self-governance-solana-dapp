// src/utils/interact-with-program.ts
/// <reference types="vitest" />

import { describe, it, expect } from 'vitest'
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Anaheim } from '../../target/types/anaheim'

const provider = anchor.AnchorProvider.env()
anchor.setProvider(provider)

const program = anchor.workspace.Anaheim as Program<Anaheim>

describe('Anaheim interact test', () => {
  it('Crée un post', async () => {
    const postAccount = Keypair.generate()
    const user = Keypair.generate()

    const tx = await program.methods
      .createPost('hello world post')
      .accounts({
        postAccount: postAccount.publicKey,
        user: user.publicKey,
      })
      .signers([user, postAccount])
      .rpc()

    console.log('✅ TX envoyé :', tx)

    // Vérification : account a bien été créé avec le contenu voulu
    const accountData = await program.account.postAccount.fetch(postAccount.publicKey)

    // Exemple d’assertion réaliste (adapte à ton type réel)
    expect(accountData.content).toContain('hello')
    expect(accountData.author.toBase58()).toBe(user.publicKey.toBase58())
  })
})
