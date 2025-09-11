// PATH: src/components/account/address.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix unused function 'fetchBalance', export for use elsewhere, matrix override!

import { PublicKey } from '@solana/web3.js'
import { isAddress } from '@solana/kit'
import bs58 from 'bs58'
import {client} from "@/lib/solana";

function base64ToBase58(input: string): string {
  const decoded = Buffer.from(input, 'base64')
  return bs58.encode(decoded)
}

// PATCH: Export fetchBalance so it's not unused
export async function fetchBalance(addressRaw: string | null | undefined) {
  if (!addressRaw || !isAddress(addressRaw)) {
    throw new Error('Invalid address input')
  }

  const pubkey = new PublicKey(addressRaw)

  const { value } = await client.arguments.getAccountInfo({pda : pubkey.toBase58()}).send()

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

// PATCH NOTES:
// - 'fetchBalance' exported for use elsewhere (prevents unused warning)
// - Ready for import in any account component/page
// - Matrix override, filename/path toujours!