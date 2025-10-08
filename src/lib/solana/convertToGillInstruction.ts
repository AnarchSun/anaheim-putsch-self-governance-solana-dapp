// src/lib/solana/convertToGillInstruction.ts
import {
    Address as SDKAddress,
} from "@solana/addresses";

import { TransactionInstruction } from "@solana/web3.js";

function toSDKAddress(s: string) {
    return undefined;
}

export function convertToGillInstruction(ix: TransactionInstruction): IInstruction {
    return {
        programAddress: toSDKAddress(ix.programId.toBase58()) as SDKAddress<string>,
        data: ix.data,
        accounts: ix.keys.map((key) => ({
            pubkey: toSDKAddress(key.pubkey.toBase58()) as SDKAddress<string>,
            isSigner: key.isSigner,
            isWritable: key.isWritable,
        })),
    };
}
