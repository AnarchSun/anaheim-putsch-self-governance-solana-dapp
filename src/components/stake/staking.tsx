import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivation } from '@/../../vendor/solana-rpc-client-extensions/js/src/stake'

export async function getStakeActivationSafe(connection: Connection, pubkey: PublicKey): Promise<getStakeActivation> {
  try {
    return new getStakeActivation(connection, pubkey, 'confirmed') // <-- utilise la version non-dépréciée ici
    // <-- utilise la version non-dépréciée ici
  } catch (e) {
    console.error('getStakeActivation (safe) failed', e)
    throw e
  }
}
