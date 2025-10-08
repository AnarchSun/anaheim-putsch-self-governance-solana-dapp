// FILE: src/components/solana/use-wallet-transaction-sign-and-send.tsx
import {Connection} from '@solana/web3.js'
import type {
    Address,
    Blockhash,
    Instruction,
    SignatureBytes,
    SignaturesMap,
    TransactionMessageBytes,
    TransactionSendingSigner
} from 'gill'
import {createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners} from 'gill'
import useSolana from './use-solana'

// Transforme un UiWalletAccount en Gill TransactionSendingSigner
function uiWalletAccountToGillSigner(account: { address: string; signTransaction: (tx: any) => Promise<any> }): TransactionSendingSigner {
    return {
        address: account.address as Address,
        async signAndSendTransactions(
            transactions: ReadonlyArray<Readonly<{ messageBytes: TransactionMessageBytes; signatures: SignaturesMap }>>,
        ): Promise<readonly SignatureBytes[]> {
            return await Promise.all(
                transactions.map(async (tx) => {
                    const signedTx = await account.signTransaction(tx as any)
                    return signedTx.signature as SignatureBytes
                })
            )
        },
    }
}

export function useWalletTransactionSignAndSend() {
    const { client, account } = useSolana()

    // 🔧 assure toujours un Connection
    const connection: Connection =
        (client as unknown as Connection)

    return async (ix: Instruction | Instruction[], signer?: TransactionSendingSigner) => {
        if (!signer && account) {
            signer = uiWalletAccountToGillSigner(account)
        }
        if (!signer) throw new Error('Wallet not connected or signer not provided')

        const x = await connection.getLatestBlockhash('processed')
        const latestBlockhash: Blockhash = x.blockhash as unknown as Blockhash

        const transaction = createTransaction({
            feePayer: signer,
            version: 0,
            latestBlockhash: {
                blockhash: latestBlockhash,
                lastValidBlockHeight: BigInt(x.lastValidBlockHeight),
            },
            instructions: Array.isArray(ix) ? ix : [ix],
        })

        const signature = await signAndSendTransactionMessageWithSigners(transaction)
        return getBase58Decoder().decode(signature)
    }
}

