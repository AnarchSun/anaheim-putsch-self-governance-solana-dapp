// src/hooks/solana/useSolanaClient.ts
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation';

export function useSolanaClient(cluster: 'devnet' | 'testnet' | 'mainnet-beta' = 'devnet') {
  // 🔁 Memoize connection to avoid re-instantiating on each render
  return useMemo ( () => {
    return new Connection ( clusterApiUrl ( cluster ), 'confirmed' )
  }, [cluster] )
}


// TODO: future fallback for deprecated getStakeActivation
async function getStakeActivationManual(connection: Connection, pubkey: PublicKey) {
  const accountInfo = await connection.getParsedAccountInfo(pubkey)

  const data = accountInfo.value?.data
  if (!data || typeof data !== 'object' || !('parsed' in data)) {
    throw new Error('Invalid or empty stake account')
  }

  const parsed = data as ParsedAccountData

  if (parsed.program !== 'stake') {
    throw new Error('Not a stake account')
  }

  const info = parsed.parsed.info
  const stake = info.stake
  const state = info.state

  const active = stake?.delegation.stake ?? 0

  return {
    state,
    active,
    inactive: 0, // fallback since we can't infer it here
  }
}
export async function getStakeActivationSafe(
  connection: Connection,
  pubkey: PublicKey
) {
  try {
    // ✅ Appel correct avec deux arguments
    return await getStakeActivation ( connection, pubkey )
  } catch (err) {
    console.warn('Vendor getStakeActivation failed, falling back manually', err)
    return await getStakeActivationManual(connection, pubkey)
  }
}


type ParsedAccountData = {
  program: 'stake'
  parsed: {
    type: string
    info: {
      state: string
      stake?: {
        delegation: {
          stake: number
          activationEpoch: string
          deactivationEpoch: string
          voter: string
        }
      }
    }
  }
}
