// FILE: src/components/solana/use-wallet-transaction-sign-and-send.tsx

import { clusterApiUrl, Connection, TransactionInstruction } from '@solana/web3.js'
import {
  createTransaction,
  signAndSendTransactionMessageWithSigners,
  TransactionSigner,
} from 'gill'
import { NominalType } from '@solana/nominal-types'

export async function createAndSendTx({
                                        signer,
                                        instructions,
                                        connection = new Connection(clusterApiUrl('devnet')),
                                      }: {
  signer: TransactionSigner
  instructions: TransactionInstruction[]
  connection?: Connection
}): Promise<NominalType<'brand', 'SignatureBytes'> & Uint8Array> {
  const latestBlockhash = await connection.getLatestBlockhash()

  const transaction = createTransaction({
    version: 0,
    feePayer: signer.address,
    blockhash: latestBlockhash.blockhash, // ✅ CORRECT
    instructions,
  })

  return await signAndSendTransactionMessageWithSigners({
    message: transaction,
    signers: [signer],
    connection,
  })
}

export async function useWalletTransactionSignAndSend({
                                                        signer,
                                                        instructions,
                                                      }: {
  signer: TransactionSigner
  instructions: TransactionInstruction[]
}): Promise<NominalType<'brand', 'SignatureBytes'> & Uint8Array> {
  const connection = new Connection(clusterApiUrl('devnet'))
  const latestBlockhash = await connection.getLatestBlockhash()

  const transaction = createTransaction({
    version: 0,
    feePayer: signer.address,
    blockhash: latestBlockhash.blockhash, // ✅ CORRECT
    instructions,
  })

  return await signAndSendTransactionMessageWithSigners({
    message: transaction,
    signers: [signer],
    connection,
  })
}
