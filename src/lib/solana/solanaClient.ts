// src/lib/solana/solanaClient.ts
import { Connection, clusterApiUrl, Cluster, Commitment } from '@solana/web3.js';

export class SolanaClient {
    connection: Connection;
    cluster: string;
    commitment: Commitment;
    getBalance: any;

    constructor(cluster: Cluster = 'devnet', commitment: Commitment = 'confirmed') {
        this.cluster = cluster;
        this.commitment = commitment;
        this.connection = new Connection(clusterApiUrl(cluster), commitment);
    }

    get rpc(): Connection {
        return this.connection;
    }
}

export const cluster: Cluster = 'devnet';
export const solanaClient = new SolanaClient(cluster);
export const client = solanaClient.rpc;
