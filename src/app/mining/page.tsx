import MiningPanel from '@/components/mining/mining-panel'
import WalletConnectButton from '../../components/wallet/wallet-connect-button'

export default function MiningPage() {
  return (
    <main className="space-y-4 p-8">
      <WalletConnectButton />
      <MiningPanel />
    </main>
  )
}
