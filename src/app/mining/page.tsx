import MiningPanel from '@/components/mining/mining-panel'
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui'


export default function MiningPage() {
  return (
    <main className="space-y-4 p-8">
      <WalletConnectButton />
      <MiningPanel />
    </main>
  )
}
