// File: src/app/api/program-info/route.ts
import { Transaction, VersionedTransaction } from '@solana/web3.js'
import { NextResponse } from 'next/server'
import { loadKeypair } from '@/lib/wallet/loadKeypair'

// Charge le wallet depuis wallet/id.json
const keypair = loadKeypair()

// ✅ Fallback si le fichier est manquant
if (!keypair) {
  console.warn('🛑 Aucun keypair trouvé. Le backend fonctionnera en mode readonly.')
}

// Signature d'une transaction selon son type
async function signTx<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
  if (!keypair) throw new Error('Backend wallet not available')

  if (tx instanceof Transaction) {
    tx.partialSign(keypair)
    return tx as T
  }

  if (tx instanceof VersionedTransaction) {
    tx.sign([keypair])
    return tx as T
  }

  throw new Error('Unsupported transaction type')
}

// Signature multiple
async function signAllTxs<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
  return Promise.all(txs.map(signTx))
}

// Endpoint de test du backend wallet
export async function GET() {
  if (!keypair) {
    return NextResponse.json({
      error: 'No backend wallet available',
    }, { status: 500 })
  }

  return NextResponse.json({
    backendWallet: keypair.publicKey.toBase58(),
  })
}
