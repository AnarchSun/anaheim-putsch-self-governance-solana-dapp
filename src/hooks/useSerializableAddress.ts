// src/hooks/useSerializableAddress.ts

import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import {SerializableAddress} from "@/@types/solana";

export function useSerializableAddress(address: PublicKey): SerializableAddress {
    return useMemo(() => ({
        toString: () => address.toString(),
        toBase58: () => address.toBase58()
    }), [address])
}