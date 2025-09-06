// Path: src/app/stake-mining/config.ts
// PATCH: Use public or valid RPC endpoint, add api key if necessary

export const SOLANA_RPC_URL =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    "https://api.devnet.solana.com"; // fallback to devnet public if isn't set

// If using paid endpoint:
// export const SOLANA_RPC_URL = "https://YOUR_PROVIDER/?api-key=YOUR_API_KEY";