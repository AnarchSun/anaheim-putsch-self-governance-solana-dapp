// PATH: src/components/solana/use-wallet-ui-signer.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Remove unused getBase58Decoder import, batch fix grunge, filename/path éternel!

import { useWallet } from '@solana/wallet-adapter-react';
import {
  address as toGillAddress,
  BaseTransactionSignerConfig,
  // PATCH: Removed unused getBase58Decoder
  // getBase58Decoder,
  signature,
  Transaction,
} from 'gill';
import { Connection, Transaction as Web3Transaction } from '@solana/web3.js';
import { NominalType } from '@solana/nominal-types';
import { TransactionOrVersionedTransaction } from '@solana/wallet-adapter-base';

export function useWalletUiSigner(rpcUrl: string): {
  address: NominalType<'brand', 'Address'> & NominalType<'stringEncoding', 'base58'> & string;
  signTransaction: <T extends TransactionOrVersionedTransaction<any>>(transaction: T) => Promise<T>;
  signTransactions(transactions: readonly Transaction[]): Promise<readonly Transaction[]>;
  signAndSendTransactions(
      transactions: readonly Transaction[],
      config?: BaseTransactionSignerConfig
  ): Promise<(NominalType<'brand', 'Signature'> & NominalType<'stringEncoding', 'base58'> & string)[]>;
} | undefined {
  const wallet = useWallet();

  if (
      !wallet.connected ||
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions ||
      !wallet.sendTransaction
  ) {
    return undefined;
  }

  const { publicKey, signTransaction, signAllTransactions, sendTransaction } = wallet;
  const connection = new Connection(rpcUrl, 'confirmed');
  // PATCH: Removed unused decoder
  // const decoder = getBase58Decoder();

  return {
    address: toGillAddress(publicKey.toBase58()),

    signTransaction,

    async signTransactions(transactions: readonly Transaction[]): Promise<readonly Transaction[]> {
      const signed = await signAllTransactions(transactions as unknown as Web3Transaction[]);
      return signed as unknown as Transaction[];
    },

    async signAndSendTransactions(
        transactions: readonly Transaction[],
        config?: BaseTransactionSignerConfig
    ): Promise<(NominalType<'brand', 'Signature'> & NominalType<'stringEncoding', 'base58'> & string)[]> {
      return await Promise.all(
          transactions.map(async (tx) => {
            const signatureBase58 = await sendTransaction(tx as unknown as Web3Transaction, connection, {
              skipPreflight: false,
              ...config,
            } as any);

            return signature(signatureBase58);
          })
      );
    },
  };
}

// PATCH NOTES:
// - Removed unused getBase58Decoder import and variable (TS6133)
// - Filename/path éternel, matrix override, batch fix grunge!