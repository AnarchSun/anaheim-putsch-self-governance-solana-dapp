// PATH: src/components/account/fetchBalance.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Unique source for fetchBalance, matrix override!

import { PublicKey } from '@solana/web3.js'
import { isAddress } from '@solana/kit'
import bs58 from 'bs58'
import { client } from "jayson"

function base64ToBase58(input: string): string {
    const decoded = Buffer.from(input, 'base64')
    return bs58.encode(decoded)
}

export async function fetchBalance(addressRaw: string | null | undefined) {
    if (!addressRaw || !isAddress(addressRaw)) {
        throw new Error('Invalid address input')
    }

    const pubkey = new PublicKey(addressRaw)

    const { value } = await client.arguments.getAccountInfo({ pda: pubkey.toBase58() }).send()

    if (!value) {
        throw new Error('Account not found')
    }

    const { lamports, owner, space, executable, rentEpoch, data } = value

    const [encodedData, format] = data

    if (format !== 'base64') {
        throw new Error(`Unsupported data format: ${format}`)
    }

    const base58Data = base64ToBase58(encodedData)

    return {
        lamports,
        owner: owner.toString(),
        space,
        executable,
        rentEpoch,
        data: base58Data,
    }
}