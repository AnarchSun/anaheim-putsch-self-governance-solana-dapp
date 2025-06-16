'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletUiDropdown() {
  return <WalletMultiButton className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800" />
}
