import { PublicKey } from '@solana/web3.js'
import { getSolanaClient } from './solanaClient'

export async function fetchStakeInfo(publicKey: PublicKey) {
  const solanaClient = getSolanaClient()

  try {
    const [activation, minDelegation, votes] = await Promise.all([
      solanaClient.getStakeActivation(publicKey),
      solanaClient.getStakeMinimumDelegation(),
      solanaClient.getVoteAccounts(),
    ])
    return { activation, minDelegation, votes }
  } catch (error) {
    console.error('Error fetching stake info:', error)
    throw error
  }
}
