// PATH: src/hooks/solana/useGetTokenAccounts.ts
// ULTRA FINAL ANARCHOPUNK BATCH FIX — TS2345: Address is not assignable to parameter of type '{ address: any; }' or 'PublicKey'
// Fix: Convert Address to PublicKey using new PublicKey(address) from @solana/web3.js

import { useQuery } from '@tanstack/react-query'
import { useConnection } from './useConnection'
import { Address } from '@solana/kit'
import { PublicKey } from '@solana/web3.js'
import { client } from "@/lib/solana";

export function useGetTokenAccounts(address: Address) {
  const connection = useConnection(client.toString(), address, "confirmed")

  return useQuery({
    queryKey: ['get-token-accounts', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) throw new Error('Adresse manquante')

      if (typeof connection?.getParsedTokenAccountsByOwner !== 'function') {
        throw new Error('Invalid connection: getParsedTokenAccountsByOwner is not callable')
      }

      // Convert Address to PublicKey before passing
      const pubkey = new PublicKey(address);

      // Call the function with the correct type
      const result = await connection.getParsedTokenAccountsByOwner(pubkey)
      // Return the result (or fallback stub value)
      return result ?? []
    },
  } as any)
}

// PATCH NOTES:
// - Import PublicKey from @solana/web3.js
// - Convert address (type Address) to PublicKey before using in Solana API calls
// - Remove use of { address } object, use address directly
// - Filename/path toujours!