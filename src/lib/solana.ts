import type { SolanaAddress, SerializableAddress } from '@/@types/solana'
import { PublicKey } from '@solana/web3.js'

export function toSolanaAddress(value: string | SerializableAddress): SolanaAddress {
    const address = typeof value === 'string' ? value : value.toBase58()
    return address as SolanaAddress
}

export function createSerializableAddress(key: PublicKey): SerializableAddress {
    return {
        toString: () => key.toString(),
        toBase58: () => key.toBase58()
    }
}