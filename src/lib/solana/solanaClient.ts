// src/lib/solanaClient.ts

import { Connection, clusterApiUrl } from '@solana/web3.js'

const defaultConnection = new Connection(clusterApiUrl('mainnet-beta'))

export function getConnection(): Connection {
  return defaultConnection
}

// Exporte tout ce dont tu as besoin ici, ajoute selon ta vision
export * from '@solana/web3.js'
