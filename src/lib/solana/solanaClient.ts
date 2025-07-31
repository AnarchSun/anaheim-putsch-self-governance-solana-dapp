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
