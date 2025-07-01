// anarcrypt.sol/anaheim-putsch-self-governance-solana-dapp/src/lib/solana/dummyWallet.ts
import { Keypair, Transaction, VersionedTransaction, Signer } from '@solana/web3.js'
import type { Wallet } from '@coral-xyz/anchor'

const dummyKeypair = Keypair.generate()

function isVersionedTransaction(tx: Transaction | VersionedTransaction): tx is VersionedTransaction {
  return (tx as VersionedTransaction).message !== undefined && !(tx instanceof Transaction)
}

export const dummyWallet: Wallet & { payer: Keypair } = {
  publicKey: dummyKeypair.publicKey,
  payer: dummyKeypair, // <-- Ajout crucial

  signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
    if (isVersionedTransaction(tx)) {
      tx.sign([dummyKeypair as Signer])
    } else {
      tx.partialSign(dummyKeypair)
    }
    return tx
  },

  signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
    for (const tx of txs) {
      if (isVersionedTransaction(tx)) {
        tx.sign([dummyKeypair as Signer])
      } else {
        tx.partialSign(dummyKeypair)
      }
    }
    return txs
  }
}
