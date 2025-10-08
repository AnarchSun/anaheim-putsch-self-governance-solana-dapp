// FILE: src/utils/solana/instructions/getTransferSolInstruction.ts

import { SystemProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Address } from "gill";

export function getTransferSolInstruction({
                                              source,
                                              destination,
                                              amount,
                                          }: {
    source: Address;
    destination: Address;
    amount: number;
}): TransactionInstruction {
    return SystemProgram.transfer({
        fromPubkey: new PublicKey(source),
        toPubkey: new PublicKey(destination),
        lamports: amount,
    });
}
