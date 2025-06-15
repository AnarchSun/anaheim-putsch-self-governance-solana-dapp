import {
  Connection,
  PublicKey,
  Commitment,
  AccountChangeCallback,
  GetBlockHeightConfig
} from '@solana/web3.js'
import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'

const RPC_URL = 'https://api.devnet.solana.com'

export function getSolanaClient() {
  const connection = new Connection(RPC_URL, 'confirmed')

  return {
    getStakeActivation: async (pubkey: PublicKey) => {
      return await getStakeActivation(connection, pubkey)
    },

    getStakeMinimumDelegation: () => Promise.resolve(1000000),

    getVoteAccounts: () => connection.getVoteAccounts(),

    getBlockHeight: (commitment?: Commitment | GetBlockHeightConfig) => connection.getBlockHeight(commitment),

    onAccountChange: (
      publicKey: PublicKey,
      callback: AccountChangeCallback,
      commitment?: Commitment
    ): number => {
      const config = commitment ? { commitment } : undefined
      return connection.onAccountChange(publicKey, callback, config)
    },

    removeAccountChangeListener: (id: number) => connection.removeAccountChangeListener(id),
  }
}
