// FILE: src/components/solana/use-wallet-ui-signer.tsx
import { useWallet } from '@solana/wallet-adapter-react'
import { TransactionSigner } from 'gill'

export function useWalletUiSigner(): TransactionSigner | undefined {
  const wallet = useWallet()

  // Évite tout usage d'arguments, même dans des erreurs
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    return undefined
  }

  return {
    address: wallet.publicKey,
    signTransaction: wallet.signTransaction,
  }
}
