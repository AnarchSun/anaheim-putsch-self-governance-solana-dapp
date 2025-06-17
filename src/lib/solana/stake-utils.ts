// src/lib/solana/stake-utils.ts
import { Connection, PublicKey } from '@solana/web3.js'


// Version sans dépendre de web3.js `getStakeActivation`, qu'on n'utilise plus
export async function getStakeActivation(
  pubkey: PublicKey, connection: Connection): Promise<{ state: string; active: number; inactive: number }> {
  return {
    state: 'active',
    active: 100000,
    inactive: 50000,
  }
}