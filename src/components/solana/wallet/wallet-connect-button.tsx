'use client'

import dynamic from 'next/dynamic'

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false },
)

export default function WalletConnectButton() {
  return <WalletMultiButtonDynamic className="bg-purple-800 text-white font-bold py-2 px-4 rounded" />
}
