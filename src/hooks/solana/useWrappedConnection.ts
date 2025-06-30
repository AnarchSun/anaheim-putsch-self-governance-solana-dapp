// src/hooks/solana/useWrappedConnection.ts
import { useMemo } from 'react'
import { ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js'
import { getPublicSolanaRpcUrl } from '@/lib/solana/solanaKitShim'

const DEFAULT_CLUSTER = 'devnet'

export function useWrappedConnection(cluster = DEFAULT_CLUSTER, _address: any, unknown: any, any: any) {
  // Stabiliser la chaîne d’URL
  const rpcUrl = useMemo(() => new getPublicSolanaRpcUrl(cluster), [cluster])

  // Créer la connexion Solana
  const connection = useMemo(() => new Connection(rpcUrl.toString(), 'confirmed'), [rpcUrl])

  // Fonction exposée pour récupérer les signatures d’une adresse
  async function getSignaturesForAddress(address: PublicKey, limit = 100): Promise<ConfirmedSignatureInfo[]> {
    try {
      return await connection.getSignaturesForAddress ( address, { limit } )
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
