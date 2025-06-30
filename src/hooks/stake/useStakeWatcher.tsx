// anarcrypt.sol/eco-subsystem/complementary-modules/getStakeActivation/js/src/stake.ts

import {
  fixCodecSize,
  getArrayCodec,
  getBytesCodec,
  getStructCodec,
  getU32Codec,
  getU64Codec,
} from '@solana/codecs'
import type { ReadonlyUint8Array } from '@solana/codecs'
import { Connection, PublicKey } from '@solana/web3.js'


// -------------------- Codecs --------------------

export type StakeActivationState =
  | 'active'
  | 'inactive'
  | 'activating'
  | 'deactivating'
  | 'uninitialized'
  | null

// -------------------- Classe Safe --------------------

export class getStakeActivationSafe {
  connection: Connection
  pollInterval: number
  pubkey: PublicKey
  state: StakeActivationState = null

  constructor(connection: Connection, pollInterval: number, pubkey: PublicKey) {
    this.connection = connection
    this.pollInterval = pollInterval
    this.pubkey = pubkey
  }

  async fetch(): Promise<void> {
    // TODO ORION: implémenter ici la logique pour récupérer les infos de stake via RPC
    // Exemple possible :
    // const accountInfo = await this.connection.getAccountInfo(this.pubkey)
    // this.state = computeStakeStateFrom(accountInfo)
    console.log('Fetching stake info (placeholder)...')
  }
}
