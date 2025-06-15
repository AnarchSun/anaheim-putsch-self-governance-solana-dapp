import { useStakeActivationStatus } from '@/hooks/stake/useStakeActivationStatus'
import { useSolanaClient } from '@/hooks/solana/useSolanaClient'
import { PublicKey } from '@solana/web3.js'

export function StakeStatus({ address }: { address: string }) {
  const connection = useSolanaClient('devnet')
  const pubkey = new PublicKey(address)
  const { status, error } = useStakeActivationStatus(pubkey, connection)

  if (error) return <div>Erreur: {error.message}</div>
  if (!status) return <div>Chargement...</div>

  return (
    <div>
      <p>État : {status.state}</p>
      <p>Actif : {status.active}</p>
      <p>Inactif : {status.inactive}</p>
    </div>
  )
}
