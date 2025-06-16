import {
  useSolanaWallet,
  useSolanaWalletAddress as _useSolanaWalletAddress,
  useSolanaWalletCluster as _useSolanaWalletCluster,
  UiWalletAccount,
} from '@wallet-ui/react'
// Si besoin : activer ces fonctions quand tu les utiliseras
/*
import {
  BaseTransactionSignerConfig,
  TransactionMessageBytes,
  TransactionSendingSigner,
  SignaturesMap,
} from 'gill'

import { address as toAddress, Address } from 'gill'
*/
export { useGetSignatures } from '@/hooks/useGetSignatures'
export { useGetBalance } from '@/hooks/solana/useGetBalance'
export { useGetTokenAccounts } from '@/hooks/solana/useGetTokenAccounts'
export { useRequestAirdrop } from '@/hooks/solana/useRequestAirdrop'
export { useTransferSol } from '@/hooks/solana/useTransferSol'

// Si besoin : activer ces fonctions quand tu les utiliseras
/*
export function getWalletAddress(): string {
  return new _useSolanaWalletAddress().toString()
}

export function getWalletCluster(): string {
  return new _useSolanaWalletCluster().toString()
}

export function createTxSigner(
  account: UiWalletAccount,
): TransactionSendingSigner {
  if (
    typeof account.address !== 'string' ||
    typeof account.signAndSendTransactions !== 'function'
  ) {
    throw new Error('Account is not a TransactionSendingSigner')
  }

  return {
    address: toAddress(account.address) as Address,
    signAndSendTransactions: (
      transactions: readonly Readonly<{
        messageBytes: TransactionMessageBytes
        signatures: SignaturesMap
      }>[],
      config?: BaseTransactionSignerConfig,
    ) => account.signAndSendTransactions(transactions, config),
  }
}
*/

// Export natif si besoin
export { useSolanaWallet, _useSolanaWalletAddress, _useSolanaWalletCluster, UiWalletAccount }
