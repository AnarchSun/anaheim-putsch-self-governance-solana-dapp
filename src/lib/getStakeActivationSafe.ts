// src/lib/getStakeActivationSafe.ts
import {Connection, PublicKey} from '@solana/web3.js'
import {getStakeActivation} from "@anza-xyz/solana-rpc-get-stake-activation";

/**
 * Wrapper async pour créer une instance getStakeActivation avec tous les arguments attendus.
 * Ajoute le 5e argument ici, par exemple un callback vide ou un mode, selon ce que la lib attend.
 */
export async function getStakeActivationSafe(
    connection: Connection,
    pubkey: PublicKey
): Promise<{ state: string; active: number; inactive: number }> {
  try {
    const result = await getStakeActivation(connection, pubkey) as unknown as {
      state: string
      active: number
      inactive: number
    }

    return {
      state: result.state ?? "unknown",
      active: result.active ?? 0,
      inactive: result.inactive ?? 0,
    }
  } catch (e) {
    console.error('getStakeActivationSafe error:', e)
    return { state: "unknown", active: 0, inactive: 0 }
  }
}

