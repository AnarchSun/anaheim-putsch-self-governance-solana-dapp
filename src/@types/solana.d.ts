
import { PublicKey } from '@solana/web3.js'

export type SolanaAddress = string & { readonly "__brand:@solana/kit": unique symbol }

export interface TokenAccountInfo {
  pubkey: SolanaAddress
  account: {
    data: {
      parsed: {
        info: {
          mint: string
          tokenAmount: {
            uiAmount: number
          }
        }
      }
    }
  }
}

export interface TransactionInfo {
  signature: string
  slot: number
  blockTime?: number
  err?: Error
}

export interface SerializableAddress {
  toString(): string
  toBase58(): string
}

export interface WalletContextState {
  publicKey: PublicKey | null
  connected: boolean
  sendTransaction: ((transaction: any) => Promise<string>) | undefined
}