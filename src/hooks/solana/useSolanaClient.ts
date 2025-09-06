// Path: src/hooks/solana/useSolanaClient.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Matrix ghosts and unused code banished.
// - Removes unused constant clusterToMoniker and cluster.
// - useQuery ALWAYS gets a queryFn. No more "no queryFn" error.
// - Only pure punk code, filename always at the top!

import { SOLANA_RPC_URL } from "@/app/stake-mining/config";
import { useQuery } from '@tanstack/react-query'
import {
  type Address,
  ClusterUrl,
  createSolanaClient,
  RpcSubscriptions,
  SendAndConfirmTransactionWithSignersFunction,
  SimulateTransactionFunction,
  SolanaRpcSubscriptionsApi,
} from 'gill'

// Only define relevant types, no dead code
export type GillSolanaClient<TClusterUrl extends ClusterUrl = ClusterUrl> = {
  rpc: {
    getBalance(address: Address): { send: () => Promise<bigint> }
    // ...other rpc methods
  }
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi> & TClusterUrl
  sendAndConfirmTransaction: SendAndConfirmTransactionWithSignersFunction
  simulateTransaction: SimulateTransactionFunction
}

// Core hook. No unused cluster moniker, no dead code.
export function useSolanaClient(): {
  client: GillSolanaClient | null
  error: unknown
  isLoading: boolean
} {
  const { data: client, error, isLoading } = useQuery<GillSolanaClient>({
    queryKey: ['solana-client', { url: SOLANA_RPC_URL }],
    queryFn: async () => createSolanaClient({ urlOrMoniker: SOLANA_RPC_URL }),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  }as any)

  return {
    client: client ?? null,
    error,
    isLoading,
  }
}