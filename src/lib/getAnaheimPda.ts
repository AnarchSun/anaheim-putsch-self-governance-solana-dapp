// FILE: src/lib/getAnaheimPda.ts
import { PublicKey } from "@solana/web3.js";

export const ANAHEIM_PROGRAM_ID = new PublicKey("EMKno4tmR5KgB9L1QqFwfARkjksgdUoFrPDAaCFBCmXa");

export function getAnaheimPda(userPubkey: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), userPubkey.toBuffer()],
        ANAHEIM_PROGRAM_ID
    );
    return pda;
}
