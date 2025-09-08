// Path: src/hooks/solana/useSolanaClient.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Batch fix types, no more illusions, only punk reality.

import { SOLANA_RPC_URL } from "@/app/stake-mining/config";
import { useQuery } from '@tanstack/react-query'
import {
  createSolanaClient,
  SolanaClient, // <-- Use the actual type returned
} from 'gill'

// REMOVE the custom type GillSolanaClient unless you fully match every field of SolanaClient!
// If you still want to extend, use type alias or interface extension.

export function useSolanaClient(): {
  client: SolanaClient | null
  error: unknown
  isLoading: boolean
  forbidden: boolean
} {
  const { data: client, error, isLoading } = useQuery<SolanaClient>({
    queryKey: ['solana-client', { url: SOLANA_RPC_URL }],
    queryFn: async () => {
      try {
        return createSolanaClient({urlOrMoniker: SOLANA_RPC_URL});
      } catch (e: any) {
        if (
            (e?.message && e.message.includes("403")) ||
            (e?.code === 403) ||
            (typeof e?.error === "object" && e.error?.code === 403)
        ) {
          throw new Error(
              "Solana RPC access forbidden (403): Your endpoint is blocked, quota exceeded, or API key is invalid.\n" +
              "Check your RPC provider (QuickNode, Helius, Triton, etc), rotate API key, or use a public endpoint for dev.\n" +
              "Current endpoint: " + SOLANA_RPC_URL
          );
        }
        throw e;
      }
    },
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  }as any);

  const forbidden =
      error &&
      typeof error === "object" &&
      ("message" in error) &&
      typeof (error as any).message === "string" &&
      (error as any).message.includes("forbidden");

  return {
    client: client ?? null,
    error,
    isLoading,
    forbidden,
  }as any
}