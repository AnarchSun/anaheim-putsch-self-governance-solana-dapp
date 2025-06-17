'use client'

import { useSolanaWalletAddress } from '@wallet-ui/react'
import { useSolanaConnectionAndCluster } from '@/hooks/solana/useSolanaConnectionAndCluster'

export function WalletStatus() {
  const walletAddressInstance = new useSolanaWalletAddress()
  const { connection, cluster } = useSolanaConnectionAndCluster('devnet')

  const address = walletAddressInstance?.toString?.() ?? 'Adresse inconnue'

  return (
    <div className="flex flex-col text-xs text-right leading-tight">
      <p>Endpoint RPC : {connection.rpcEndpoint}</p>
      <p>Cluster actuel : {cluster}</p>
      <p className="text-neutral-600 dark:text-neutral-300 truncate max-w-[200px]">
        🧙 Adresse : <span className="font-mono">{address}</span>
      </p>
    </div>
  )
}
