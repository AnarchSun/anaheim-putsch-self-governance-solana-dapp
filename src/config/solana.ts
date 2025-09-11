// PATH: src/config/solana.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Import network, cluster, programId, AND walletPubkey from .env.local

import { PublicKey } from "@solana/web3.js";

export const SOLANA_CLUSTER_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://api.devnet.solana.com";
// PATCH: programId batch fixé depuis anchor anchor/IDL
export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || "83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB";
export const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER || "devnet";
export const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || "https://api.devnet.solana.com";

// PATCH: Add walletPubkey constant, imported and ready for every punk dapp
export const WALLET_PUBKEY = new PublicKey("8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX");
