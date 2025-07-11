// File: src/lib/stake/fetchStakeState.ts

import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'
import { Connection, PublicKey } from '@solana/web3.js'

type StakeState = 'active' | 'inactive' | 'activating' | 'deactivating'

export async function fetchStakeState(pubkey: PublicKey): Promise<StakeState | null> {
    try {
        const connection = new Connection('https://api.devnet.solana.com')

        const result = await getStakeActivation(connection, pubkey) as unknown as {
            state: StakeState
            active: number
            inactive: number
        }

        return result.state ?? null
    } catch (e) {
        console.error('fetchStakeState error:', e)
        return null
    }
}
