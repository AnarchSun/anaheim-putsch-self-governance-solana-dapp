// src/lib/solanaClient.ts
import { Connection, clusterApiUrl } from '@solana/web3.js'

const defaultConnection = new Connection(clusterApiUrl('mainnet-beta'))

export * from '@solana/web3.js'

// Cette constante n’est pas utilisée, on la supprime
// const defaultConnection = new Connection (clusterApiUrl('mainnet-beta'))

// Suppression aussi de la fonction getConnection si inutilisés exports
//  function getConnection(): Connection {
//   return defaultConnection
//}

export * from '@solana/web3.js'
