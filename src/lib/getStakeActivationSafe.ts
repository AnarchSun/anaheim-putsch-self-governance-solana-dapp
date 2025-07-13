// src/lib/getStakeActivationSafe.ts
import { ExtendedConnection } from '@/lib/ExtendedConnection'
import { Connection, PublicKey } from '@solana/web3.js'

/**
 * Wrapper async pour créer une instance getStakeActivation avec tous les arguments attendus.
 * Ajoute le 5e argument ici, par exemple un callback vide ou un mode, selon ce que la lib attend.
 */
export async function getStakeActivationSafe(
  connection: ExtendedConnection,
  pollInterval: number,
  pubkey: PublicKey
): Promise<getStakeActivation> {
  try {
    // Exemple concret : on ajoute null comme 5e argument, à adapter selon lib
    return new getStakeActivation(connection, pubkey, 'confirmed')
  } catch (e) {
    console.error('getStakeActivationSafe failed:', e)
    throw e
  }
}
export class getStakeActivation {
  constructor(
    public connection: Connection, // ← utilise le vrai Solana Connection ici
    public publicKey: PublicKey,
    public confirmed: string
  ) {}
}
