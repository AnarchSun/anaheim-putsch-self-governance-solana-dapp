// src/lib/solana/wrapConnectionWithRpc.tsx
import { Connection, PublicKey, Commitment } from '@solana/web3.js'
import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'

const RPC_URL = 'https://api.devnet.solana.com'

export function getSolanaClient() {
  const connection = new Connection(RPC_URL, 'confirmed')

  return {
    // Ne pas passer le troisième argument, la lib ne le veut pas
    getStakeActivation: (pubkey: PublicKey) =>
      getStakeActivation(connection, pubkey),

    getStakeMinimumDelegation: () => Promise.resolve(1000000), // placeholder

    getVoteAccounts: () => connection.getVoteAccounts(),

    getBlockHeight: (commitment?: Commitment) => connection.getBlockHeight(commitment),

    onAccountChange: (
      publicKey: PublicKey,
      callback: Parameters<Connection['onAccountChange']>[1],
      commitment: Commitment = 'confirmed'
    ) => {
      return connection.onAccountChange(publicKey, callback, { commitment })
    },

    removeAccountChangeListener: async (id: number) =>
      connection.removeAccountChangeListener(id),
  }
}

export class wrapConnectionWithRpc {
  constructor(connection: Connection) {
      // YODO ORION XXX
  }

}
