import { PublicKey } from '@solana/web3.js'
import { assertIsAddress } from '@solana/addresses'
import { useSolanaClient } from 'gill-react'

// Fonction asynchrone pour obtenir le solde (en lamports)
export async function getBalanceRaw(address: string) {
  assertIsAddress(address) // throws if invalid

  const client = useSolanaClient() // hook (ou passe en paramètre si hors React)
  const pubkey = new PublicKey(address)

  const result = await client.rpc.getAccountInfo(pubkey).send()

  if (!result.value) throw new Error('Account not found')

  return result.value.lamports
}

export class address {
}