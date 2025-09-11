// src/components/wallet/walllet-context.tsx
'use client'

import React, { FC, useMemo, useContext, createContext } from 'react'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

import '@solana/wallet-adapter-react-ui/styles.css'

// Constante configurable pour l’endpoint réseau
const CLUSTER_ENDPOINT = 'https://api.devnet.solana.com'

// 🔮 Type + contexte pour cluster
type Cluster = {
  label: string
  urlOrMoniker: string
}

// 🧠 Contexte Cluster
const ClusterContext = createContext<Cluster | null>(null)

// 🎛️ Provider principal
export const WalletContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  const cluster: Cluster = useMemo(
    () => ({
      label: 'Mainnet Beta',
      urlOrMoniker: CLUSTER_ENDPOINT,
    }),
    [],
  )

  return (
    <ConnectionProvider endpoint={CLUSTER_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ClusterContext.Provider value={cluster}>{children}</ClusterContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

/// 🔌 Hook d'accès au wallet
export const useWalletUi = () => {
  return useWallet()
}

/// 🔌 Hook d’accès au cluster
export const useWalletUiCluster = () => {
  const cluster = useContext(ClusterContext)
  if (!cluster) throw new Error('useWalletUiCluster must be used within WalletContextProvider')
  return { cluster }
}
