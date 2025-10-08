// File: src/app/api/program-info/route.ts
import { NextResponse } from 'next/server'
import { loadKeypair } from '@/lib/wallet/loadKeypair'

// Charge le wallet depuis wallet/id.json
const keypair = loadKeypair()

if (!keypair) {
  console.warn('🛑 Aucun keypair trouvé. Le backend fonctionnera en mode readonly.')
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
