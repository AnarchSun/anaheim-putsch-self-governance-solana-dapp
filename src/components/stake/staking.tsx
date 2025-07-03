// File: src/components/stake/staking.tsx

import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivation } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'

export async function stakeAccountDebug(pubkey: PublicKey) {
  const connection = new Connection('https://api.devnet.solana.com')
  const activation = new getStakeActivation(connection, pubkey.toBase58(), 'confirmed')
  await activation.fetch()
  console.log('Activation state:', (activation as any)?.state)
}
