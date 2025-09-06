// Path: src/utils/solanaConnection.ts
// ALWAYS use a public endpoint or add your API key for the mainnet!

import { Connection, clusterApiUrl } from "@solana/web3.js";

// DEVNET (no API key needed)
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// MAINNET (with an API key for Helius, Triton, GenesysGo, etc.)
export const mainnetConnection = new Connection('https://api.helius.xyz/?api-key=TON_API_KEY', 'confirmed');