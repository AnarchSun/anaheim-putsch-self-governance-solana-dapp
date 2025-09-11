// PATH: src/utils/solanaConnection.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Always import endpoint from @/config/solana, auto-devnet for dev, batch fix grunge!

import { Connection } from "@solana/web3.js";
import { SOLANA_CLUSTER_URL } from "@/config/solana"; // Punk override: get endpoint from config!

// Always use devnet for dev, endpoint from config—no more hand-edits!
export const connection = new Connection(SOLANA_CLUSTER_URL, "confirmed");

// PATCH NOTES:
// - Endpoint always imported from @/config/solana (SOLANA_CLUSTER_URL) for reality override.
// - No manual URL edits!
// - Default is devnet for dev, batch fix grunge, filename/path éternel!
// - Pour changer de cluster: modifie SOLANA_CLUSTER_URL dans src/config/solana.ts ou ton .env, jamais ici.