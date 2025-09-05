import { StakeInfo } from '@/components/stake/stake-info'
import { Connection } from '@solana/web3.js'

const connection = new Connection('https://api.devnet.solana.com')

export default function StakePage() {
    // Replace with your stake address
    const stakeAddress = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

    return (
        <main className="p-4">
            <h1 className="text-xl font-bold">Stake Info Demo</h1>
            <StakeInfo stakeAddress={stakeAddress} connection={connection} />
            {/* ...other content... */}
        </main>
    )
}