// src/app/layout.tsx
import WalletContextProvider from '@/components/wallet/WalletContextProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
    <body>
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
    </body>
    </html>
  )
}
