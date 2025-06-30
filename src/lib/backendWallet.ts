import {
  Transaction,
  VersionedTransaction,
  Keypair,
  PublicKey,
} from '@solana/web3.js'

const payer = Keypair.generate()
const readOnlyWallet = {
  publicKey: payer.publicKey,
  signTransaction: undefined,
  signAllTransactions: undefined,
}

export const backendWallet = {
  payer,
  publicKey: payer.publicKey,
  signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
    if (tx instanceof Transaction) {
      tx.partialSign(payer)
    } else if (tx instanceof VersionedTransaction) {
      tx.sign([payer])
    }
    return tx
  },
  signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
    return txs.map((tx) => {
      if (tx instanceof Transaction) {
        tx.partialSign(payer)
      } else if (tx instanceof VersionedTransaction) {
        tx.sign([payer])
      }
      return tx
    })
  },
}
