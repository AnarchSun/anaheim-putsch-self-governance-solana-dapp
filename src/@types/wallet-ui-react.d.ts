// src/@types/wallet-ui-react.d.ts
declare module '@wallet-ui/react' {
  import * as React from 'react'

  export function useSolanaWallet(): {
    connected: boolean
    publicKey: string | null
    connect: () => Promise<void>
    disconnect: () => Promise<void>
  }

  export function useWalletUi(): {
    account?: UiWalletAccount
  }

  export function useSolanaWalletAddress(): string | null

  export function useSolanaWalletCluster(): unknown

  export interface WalletUiDropdownProps {
    onSelect?: (value: string) => void
    selected?: string
    options?: string[]
  }

  export const WalletUiDropdown: React.FC<WalletUiDropdownProps>

  export class UiWalletAccount {
    address: string

    // Optionnel, si tu veux l'utiliser dans ton UI comme un PublicKey
    toBase58(): string {
      return this.address
    }
  }
}
