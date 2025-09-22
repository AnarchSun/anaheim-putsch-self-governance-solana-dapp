// FILE: src/config/solana.js
import { PublicKey } from "@solana/web3.js";
import useSolana from "../components/solana/use-solana.tsx"; // relative path to the JS hook

export const SOLANA_CLUSTER_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://api.devnet.solana.com";

export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || "83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB";

export let CLUSTER = process.env.NEXT_PUBLIC_CLUSTER || "devnet";

export const WALLET_PUBKEY = new PublicKey(
    process.env.NEXT_PUBLIC_WALLET_PUBKEY || "9RGSbPxpKjSsVd57PfgQnCgBGoZ8upjTeFqCH4wowdfx"
);

export const SOLANA_RPC_ENDPOINT =
    process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || "https://api.devnet.solana.com";

// export default runtime hook (optional, if you want to import the hook from config)
export default useSolana;
