
import { PublicKey } from '@solana/web3.js'

declare type Address = string & { readonly "__brand:@solana/kit": unique symbol }

export interface TokenAccountInfo {
    pubkey: Address
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

export interface SerializedPublicKey {
    toBase58(): string
    toString(): string
}