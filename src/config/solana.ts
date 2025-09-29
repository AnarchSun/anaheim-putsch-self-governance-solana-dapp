// FILE: src/config/solana.js
import { PublicKey } from "@solana/web3.js";

export const SOLANA_CLUSTER_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://api.devnet.solana.com";

export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || "83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB";

export const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER || "devnet";

export const WALLET_PUBKEY = new PublicKey(
    process.env.NEXT_PUBLIC_WALLET_PUBKEY || "9RGSbPxpKjSsVd57PfgQnCgBGoZ8upjTeFqCH4wowdfx"
);

export const SOLANA_RPC_ENDPOINT =
    process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || "https://api.devnet.solana.com";
