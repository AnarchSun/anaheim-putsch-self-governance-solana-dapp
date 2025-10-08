// Path: tests/anaheim.spec.ts
import * as anchor from '@coral-xyz/anchor'
import { Program, AnchorError } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import type { Anaheim } from '../target/types/anaheim'
import { describe, it, expect, beforeEach } from 'vitest'

describe('anaheim', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const payer = provider.wallet as anchor.Wallet
  const {account, methods: {close, createPost, decrement, increment, initialize, set}} = anchor.workspace.Anaheim as Program<Anaheim>

  let anaheimKeypair: Keypair

  const fetchAndExpectCount = async (expectedCount: number) => {
    const acc = await account.anaheimAccount.fetch(anaheimKeypair.publicKey)
    expect(acc.count).toEqual(expectedCount)
  }

  beforeEach(async () => {
    anaheimKeypair = Keypair.generate()

    await initialize()
        .accounts({
          anaheim: anaheimKeypair.publicKey,
          payer: payer.publicKey,
        })
        .signers([anaheimKeypair])
        .rpc()
  })

  it('initializes Anaheim counter to 0', async () => {
    await fetchAndExpectCount(0)
  })

  it('increments Anaheim counter', async () => {
    await increment().accounts({ anaheim: anaheimKeypair.publicKey }).rpc()
    await fetchAndExpectCount(1)
  })

  it('decrements Anaheim counter', async () => {
    await increment().accounts({ anaheim: anaheimKeypair.publicKey }).rpc()
    await decrement().accounts({ anaheim: anaheimKeypair.publicKey }).rpc()
    await fetchAndExpectCount(0)
  })

  it('sets Anaheim counter to a specific value', async () => {
    await set(42).accounts({ anaheim: anaheimKeypair.publicKey }).rpc()
    await fetchAndExpectCount(42)
  })

  it('closes the Anaheim account', async () => {
    await close()
        .accounts({
          anaheim: anaheimKeypair.publicKey,
          payer: payer.publicKey,
        })
        .rpc()

    const accountInfo = await account.anaheimAccount.fetchNullable(anaheimKeypair.publicKey)
    expect(accountInfo).toBeNull()
  })

  it('fails to create post with too long content', async () => {
    const tooLongContent = 'x'.repeat(300)
    const postKeypair = Keypair.generate()
    const postStruct = {
      content: tooLongContent,
      title: "Too Long",
      author: payer.publicKey,
    }

    try {
      await createPost(postStruct)
          .accounts({
            post: postKeypair.publicKey,
            payer: payer.publicKey,
          })
          .signers([postKeypair])
          .rpc()

      throw new Error('Expected createPost to fail but it succeeded')
    } catch (err: unknown) {
      const anchorErr = err as AnchorError
      if (anchorErr.error?.errorCode?.code === 'ContentTooLong') {
        expect(anchorErr.error.errorCode.code).toBe('ContentTooLong')
      } else {
        throw err
      }
    }
  })

  it('initializes, increments, and closes cleanly', async () => {
    const localKey = Keypair.generate()

    await initialize()
        .accounts({
          anaheim: localKey.publicKey,
          payer: payer.publicKey,
        })
        .signers([localKey])
        .rpc()

    await increment().accounts({ anaheim: localKey.publicKey }).rpc()

    const result = await account.anaheimAccount.fetch(localKey.publicKey)
    expect(result.count).toEqual(1)

    await close()
        .accounts({
          anaheim: localKey.publicKey,
          payer: payer.publicKey,
        })
        .rpc()

    const closed = await account.anaheimAccount.fetchNullable(localKey.publicKey)
    expect(closed).toBeNull()
  })
})
