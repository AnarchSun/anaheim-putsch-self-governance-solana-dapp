// File: src/lib/ExtendedConnection.ts
import { Connection, PublicKey } from '@solana/web3.js'

export class ExtendedConnection extends Connection {
  private _pubkey?: PublicKey

  get pubkey(): PublicKey | undefined {
    return this._pubkey
  }

  set pubkey(value: PublicKey | undefined) {
    this._pubkey = value
  }

  constructor(endpoint: string) {
    super(endpoint)
  }
}
