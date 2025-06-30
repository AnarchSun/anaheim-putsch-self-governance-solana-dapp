// src/lib/solana/fetchStakeActivation.ts
import { Connection, PublicKey } from '@solana/web3.js'


export async function fetchStakeActivation(pubkey: PublicKey) {
  const connection = new Connection('https://api.devnet.solana.com')
  try {
    return await connection.getStakeActivation ( pubkey )
  } catch (e) {
    console.error('Erreur lors de l’activation:', e)
    return null
  }
}
