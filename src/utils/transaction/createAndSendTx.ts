// FILE: src/utils/transaction/createAndSendTx.ts
import {
    createTransaction,
    signAndSendTransactionMessageWithSigners,
    TransactionSigner,

} from 'gill'

import {
    clusterApiUrl,
    Connection,
    TransactionInstruction,
} from '@solana/web3.js'

import { Address } from '@solana/addresses'
import { toAddress } from '@/lib/solana/solanaKitShim'

type SignatureBytes = Uint8Array & { /* Brand here */ }

// Convert web3.js TransactionInstruction → Gill IInstruction
// Create a type mimicking what Gill expects, minimal and permissive:
type GillAccountMeta = {
    pubkey: Address;
    isSigner: boolean;
    isWritable: boolean;
    address?: unknown;
    role?: unknown;
}

function convertToGillInstruction(ix: TransactionInstruction) {
    return {
        programAddress: toAddress(ix.programId.toBase58()) as unknown as Address,
        accounts: ix.keys.map((key) =>
            ({
                pubkey: toAddress(key.pubkey.toBase58()) as unknown as Address,
                isSigner: key.isSigner,
                isWritable: key.isWritable,
                address: undefined,
                role: undefined,
            }) as unknown as GillAccountMeta
        ) as readonly GillAccountMeta[],
        data: ix.data,
    }
}

export async function createAndSendTx({
                                          signer,
                                          instructions,
                                          connection = new Connection(clusterApiUrl('devnet')),
                                      }: {
    signer: TransactionSigner
    instructions: TransactionInstruction[]
    connection?: Connection
}): Promise<SignatureBytes> {
    const latestBlockhash = await connection.getLatestBlockhash()

    const gillInstructions = instructions.map(convertToGillInstruction)

    const transactionMessage = createTransaction({
        version: 0,
        feePayer: signer.address as unknown as Address,
        instructions: gillInstructions,
        latestBlockhash: latestBlockhash as unknown, // force type if needed
    })

    // Try 'transaction' or 'message' depending on your Gill version:
    return await signAndSendTransactionMessageWithSigners({
        transaction: transactionMessage,
        signers: [signer],
        connection,
    })
}
