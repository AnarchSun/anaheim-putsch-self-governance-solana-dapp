// File: src/components/stake/staking.tsx

import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'
import {state} from "@lit/reactive-element/decorators.js";


export async function stakeAccountDebug(pubkey: PublicKey) {
  // Appelle la fonction directement (sans "new") et en passant bien un PublicKey
  const connection = new Connection('https://api.devnet.solana.com'), {} = await getStakeActivation(connection, pubkey);

  console.log('Activation state:', state)
}
