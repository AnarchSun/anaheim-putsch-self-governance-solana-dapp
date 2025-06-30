// src/components/account/address.tsx (ligne 1-27)
// src/components/account/address.tsx
import { PublicKey } from '@solana/web3.js'
import { assertIsAddress } from '@solana/addresses'
import { useSolanaClient } from 'gill-react'
import { useEffect, useState } from 'react'

// Hook React pour obtenir le solde de façon asynchrone et sans illusions
export function useBalanceRaw(address: string | any) {
  const client = useSolanaClient()
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (!address) {
      setBalance(null)
      return
    }

    async function fetchBalance() {
      try {
        assertIsAddress(address)
        const pubkey = new PublicKey(address)
        const result = await client.rpc.getAccountInfo(pubkey).send()
        if (!result.value) {
          setBalance(null)
          return
        }
        setBalance(result.value.lamports)
      } catch (error) {
        console.error('Erreur fetchBalance:', error)
        setBalance(null)
      }
    }

    void fetchBalance() //  Ici, on montre qu'on s'en fiche du résultat direct
  }, [address, client])


  return balance
}
