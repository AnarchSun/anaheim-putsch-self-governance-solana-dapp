// src/app/api/program-info/route.ts
import { Keypair, Transaction, VersionedTransaction } from '@solana/web3.js'
import { Wallet } from '@coral-xyz/anchor'
import fs from 'fs'
import path from 'path'

const KEYPAIR_PATH = path.join(process.cwd(), 'wallet', 'id.json')

function loadKeypair(): Keypair {
  const raw = fs.readFileSync(KEYPAIR_PATH, 'utf-8')
  const secret = Uint8Array.from(JSON.parse(raw))
  return Keypair.fromSecretKey(secret)
}

const keypair = loadKeypair()

// Helper pour signer partiellement selon le type de transaction
async function signTx<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
  if (tx instanceof Transaction) {
    tx.partialSign(keypair)
    return tx as T
  } else if (tx instanceof VersionedTransaction) {
    tx.sign([keypair])
    return tx as T
  }
  throw new Error('Transaction type not supported for partial signing')
}

async function signAllTxs<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
  return Promise.all(txs.map(signTx))
}

// Backend Wallet compatible Anchor
export const backendWallet: Wallet = {payer: keypair, publicKey: keypair.publicKey, signTransaction: signTx, signAllTransactions: signAllTxs,}
