// src/app/stake/pubkey.tsx
import { Connection, PublicKey } from '@solana/web3.js'

async function fetchStakeActivation() {
  const connection = new Connection('https://api.devnet.solana.com')
  const pubkey = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')

  try {
    const activation = await connection.getStakeActivation(pubkey)
    console.log('Activation:', activation)
    return activation
  } catch (e) {
    console.error('Erreur:', e)
    return null
  }
}
