<<<<<<< HEAD
// src/lib/solanaClient.ts


export * from '@solana/web3.js'

// Cette constante n’est pas utilisée, on la supprime
// const defaultConnection = new Connection (clusterApiUrl('mainnet-beta'))

// Suppression aussi de la fonction getConnection si inutilisés exports
//  function getConnection(): Connection {
//   return defaultConnection
//}

export * from '@solana/web3.js'
=======
// src/lib/solana/solanaClient.ts
import { Connection, clusterApiUrl, Cluster, Commitment } from '@solana/web3.js';

export class SolanaClient {
    connection: Connection;
    cluster: string;
    commitment: Commitment;

    constructor(cluster: Cluster = 'mainnet-beta', commitment: Commitment = 'confirmed') {
        this.cluster = cluster;
        this.commitment = commitment;
        this.connection = new Connection(clusterApiUrl(cluster), commitment);
    }

    get rpc(): Connection {
        return this.connection;
    }
}

export const cluster: Cluster = 'mainnet-beta';
export const solanaClient = new SolanaClient(cluster);
export const client = solanaClient.rpc;
>>>>>>> main
