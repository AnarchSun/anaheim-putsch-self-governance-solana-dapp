// src/app/stake/stake-page.tsx
'use client'

import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'

const pubkeyString = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

async function fetchStakeActivation(
  connection: Connection,
  pubkey: PublicKey,
  epoch?: number
): Promise<any | null> {
  try {
    return new getStakeActivationSafe ( connection, pubkey, epoch )
  } catch (e) {
    console.error('Error fetching stake activation:', e)
    return null
  }
}
