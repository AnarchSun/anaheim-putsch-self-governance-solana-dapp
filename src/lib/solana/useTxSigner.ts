// src/lib/solana/useTxSigner.ts
import { TransactionSendingSigner } from 'gill'

export declare function useWalletAccountTransactionSendingSigner(): TransactionSendingSigner;

export function useTxSigner() {
  const signer = useWalletAccountTransactionSendingSigner()

  if (!signer || typeof signer.address !== 'string') {
    throw new Error('Invalid signer from wallet hook')
  }

  return signer
}
