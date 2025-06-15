//  src/@types/wallet-ui-react.d.ts
declare module '@wallet-ui/react' {
  import * as React from 'react';

  export const useSolanaWallet: () => {
    connected: boolean;
    publicKey: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
  };

  export interface WalletUiDropdownProps {
    onSelect?: (value: string) => void;
    selected?: string;
    options?: string[];
  }

  export const WalletUiDropdown: React.FC<WalletUiDropdownProps>;

  export interface WalletProviderProps {
    children: React.ReactNode;
    defaultCluster?: string;
    autoConnect?: boolean;
  }

  export interface WalletProviderState {
    connected?: boolean;
    walletName?: string;
  }

  export class WalletProvider extends React.Component<
    WalletProviderProps,
    WalletProviderState
  > {}

  export class useWalletUi {
    // à implémenter si utilisé
  }

  export class useWalletUiCluster {
    id: string
  }

  export class useWalletUiCluster {
  }

  export class useWalletAccountTransactionSendingSigner {
    constructor(account: UiWalletAccount, id) {
      this._account = account
      this._id = id

    }

  }

  export class UiWalletAccount {
    address: NominalType<'brand', 'Address'> & NominalType<'stringEncoding', 'base58'> & string
    signAndSendTransactions(transactions: readonly Readonly<{
      messageBytes: TransactionMessageBytes;
      signatures: SignaturesMap
    }>[], config: BaseTransactionSignerConfig | undefined) {
      this._transactions = transactions
      this._config = config
      return Promise.resolve ( [] )
    }
  }

  export class useSolanaWalletAddress {
    value : null
    current: JSX.Element
  }

  export class useSolanaWalletCluster {
    current: any
  }
}
