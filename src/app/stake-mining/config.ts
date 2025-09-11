// Path: src/app/stake-mining/config.ts
// ULTRA FINAL ANARCHOPUNK PATCH: TS7053 index signature fix, no hardcoded endpoints, auto cluster switch, filename/path éternel!

const CLUSTER: "devnet" | "testnet" | "mainnet-beta" =
    (process.env.NEXT_PUBLIC_CLUSTER as "devnet" | "testnet" | "mainnet-beta") ||
    (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") ||
    "devnet"; // Switch cluster in .env: devnet, mainnet-beta, testnet

const PUBLIC_RPC: Record<"devnet" | "testnet" | "mainnet-beta", string> = {
    devnet: "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
    "mainnet-beta": "https://api.mainnet-beta.solana.com"
};

export const SOLANA_RPC_URL =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    process.env.SOLANA_RPC_URL ||
    PUBLIC_RPC[CLUSTER];

// For QuikNode, Helius, etc., set in .env.local:
// NEXT_PUBLIC_CLUSTER="mainnet-beta"
// NEXT_PUBLIC_SOLANA_RPC_URL="https://your-provider.com/YOUR_API_KEY"

// PATCH NOTES:
// - TS7053 index signature error fixed: cluster type is explicit, Record type for RPC object.
// - No more manual endpoint edits: auto network switch via CLUSTER env.
// - Change network (devnet/mainnet-beta/testnet) or provider endpoint in .env/local, never code.
// - Batch fix grunge, filename/path éternel, matrix punk override!