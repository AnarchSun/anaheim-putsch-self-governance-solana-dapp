// Path: src/app/stake-mining/config.ts
// ULTRA FINAL ANARCHOPUNK PATCH: No hardcoded dead endpoints, use .env or secrets.
// - Reads endpoint from env, fallback to public RPC if missing.
// - Punk patch: change the endpoint easily without code edits!

// Use environment variable, fallback to mainnet public endpoint (for dev only)
export const SOLANA_RPC_URL =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    process.env.SOLANA_RPC_URL ||
    "https://api.devnet.solana.com"; // Don't use public for prod, only for dev/test!

// For QuikNode, Helius, etc., set in .env:
// NEXT_PUBLIC_SOLANA_RPC_URL="https://your-provider.com/YOUR_API_KEY"