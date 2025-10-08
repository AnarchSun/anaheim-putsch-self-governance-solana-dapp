// FILE: src/utils/createAndSendTx.ts

import {
    createTransaction,
    signAndSendTransactionMessageWithSigners,
} from "gill";

import type { TransactionSigner, Instruction } from "gill";
import type { Address } from "@solana/addresses";
import type { SignatureBytes } from "@solana/keys";
import type { BlockhashWithExpiryBlockHeight } from "@solana/web3.js";

/**
 * Create and send a transaction using gill-compatible components.
 *
 * @param instruction - a Gill-compatible Instruction
 * @param feePayer - the wallet fee payer address
 * @param recentBlockhash - includes `blockhash` and `lastValidBlockHeight`
 * @param signers - array of TransactionSigners or Addresses
 */
export async function createAndSendTx(
    instruction: Instruction,
    feePayer: Address,
    recentBlockhash: BlockhashWithExpiryBlockHeight,
    signers: (TransactionSigner | Address)[]
): Promise<SignatureBytes> {
    const transaction = createTransaction({
        version: "v0",
        instructions: [instruction],
        feePayer,
        ...recentBlockhash,
    } as any);

    const signature = await signAndSendTransactionMessageWithSigners({
        transactionMessage: transaction,
        signers,
    }as any);

    return signature;
}
