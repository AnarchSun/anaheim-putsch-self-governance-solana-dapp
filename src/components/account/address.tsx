// src/components/account/address.tsx (ligne 1-27)
import { PublicKey } from '@solana/web3.js'
import { isAddress } from '@solana/kit'
import { client } from 'jayson'
import bs58 from 'bs58'

function base64ToBase58(input: string): string {
  const decoded = Buffer.from(input, 'base64')
  return bs58.encode(decoded)
}

async function fetchBalance(addressRaw: string | null | undefined) {
  if (!addressRaw || !isAddress(addressRaw)) {
    throw new Error('Invalid address input')
  }

  const pubkey = new PublicKey(addressRaw)

  const { value } = await client.arguments.getAccountInfo(pubkey.toBase58()).send()

  if (!value) {
    throw new Error('Account not found')
  }

  const { lamports, owner, space, executable, rentEpoch, data } = value

  // Ici on reste sur le format base64 si tu veux parser plus tard
  const [encodedData, format] = data

  if (format !== 'base64') {
    throw new Error(`Unsupported data format: ${format}`)
  }

  // Si tu veux un base58 propre
  const base58Data = base64ToBase58(encodedData)

  return {
    lamports,
    owner: owner.toString (), // évite Address type
    space,
    executable,
    rentEpoch,
    data: base58Data, // reste une string, pas besoin de cast vers Base58EncodedBytes
  }
}
