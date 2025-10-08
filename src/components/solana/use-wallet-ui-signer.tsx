// src/components/solana/use-wallet-ui-signer.tsx
import {
  UiWalletAccount,
} from '@wallet-standard/ui-core'
import useSolana from '@/components/solana/use-solana'
import { useWalletAccountTransactionSendingSigner } from "@wallet-ui/react"

export function useWalletUiSigner() {
  const { account, cluster } = useSolana()

  // PATCH: cluster is a string, not an object with "id"
  // If cluster is already a moniker like "mainnet-beta", "devnet", etc.
  const signer = useWalletAccountTransactionSendingSigner(
      (account ?? {}) as UiWalletAccount,
      `solana:${cluster}`
  )

  return account ? signer : null
}