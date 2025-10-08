// FILE: src/components/solana/use-wallet-transaction-sign-and-send.tsx
import { Connection } from '@solana/web3.js'
import type { Instruction, TransactionSendingSigner, Blockhash } from 'gill'
import { createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners } from 'gill'
import type { UiWalletAccount, UiWalletHandle } from '@wallet-standard/ui-core'
import useSolana from "@/components/solana/use-solana"

// ✅ Définir le symbol correctement
const uiWalletHandleSymbol: unique symbol = Symbol('~uiWalletHandle')

function toWalletHandle(account: UiWalletAccount): UiWalletHandle {
  return {
    ...account,
    [uiWalletHandleSymbol]: uiWalletHandleSymbol, // TS-safe
    features: account.features ?? [],
  }
}

export function useWalletTransactionSignAndSend() {
  const { client, account } = useSolana()
  const connection = typeof client === 'string' ? new Connection(client) : client

  return async (ix: Instruction | Instruction[], signer?: TransactionSendingSigner) => {
    if (!signer && account) {
      signer = toWalletHandle(account) as unknown as TransactionSendingSigner
    }

    const x = await connection.getLatestBlockhash('processed')
    const latestBlockhash: Blockhash = x.blockhash as unknown as Blockhash

    const transaction = createTransaction({
      feePayer: signer!,
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
