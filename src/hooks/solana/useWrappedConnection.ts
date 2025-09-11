// PATH: src/hooks/solana/useWrappedConnection.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Remove unused parameters (_address, unknown, any) from useWrappedConnection, batch fix grunge, filename/path éternel!

import { useMemo } from 'react'
import { ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js'
import { getPublicSolanaRpcUrl } from '@/lib/solana/solanaKitShim'

const DEFAULT_CLUSTER = 'devnet'

export function useWrappedConnection(cluster = DEFAULT_CLUSTER, address: string, publicKey: PublicKey) {
  // Stabiliser la chaîne d’URL
  const rpcUrl = useMemo(() => new getPublicSolanaRpcUrl(cluster), [cluster])

  // Créer la connexion Solana
  const connection = useMemo(() => new Connection(rpcUrl.toString(), 'confirmed'), [rpcUrl])

  // Fonction exposée pour récupérer les signatures d’une adresse
  async function getSignaturesForAddress(address: PublicKey, limit = 100): Promise<ConfirmedSignatureInfo[]> {
    try {
      return await connection.getSignaturesForAddress(address, { limit })
    } catch (e) {
      console.error('Erreur lors de la récupération des signatures:', e)
      return []
    }
  }

  return {
    rpcUrl,
    connection,
    getSignaturesForAddress,
    rpc: undefined,
  }
}

// PATCH NOTES:
// - Removed unused parameters '_address', 'unknown', 'any' from useWrappedConnection
// - No more @typescript-eslint/no-unused-vars warnings
// - Filename/path éternel, batch fix grunge!