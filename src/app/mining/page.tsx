// FILE: src/app/page.tsx

// THIS IS THE CRITICAL FIX.
// This directive tells Next.js to render this component on the client,
// giving it access to hooks and browser APIs.
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';
import MiningClient from '@/components/mining/MiningClient';
import { TransferSolFeature } from '@/components/account/account-data-access';
import { ClientOnly } from '@/components/ClientOnly';
import { useInitialize } from '@/hooks/useInitialize';
import { useAnaheimProgram } from '@/hooks/useProgram';

export default function HomePage() {
  const { connected } = useWallet();
  const { program, provider } = useAnaheimProgram();
  const initializeMutation = useInitialize();
  const [hasTriedInit, setHasTriedInit] = React.useState(false);

  // This effect attempts to auto-initialize the program once the wallet is connected.
  React.useEffect(() => {
    if (
      program &&
      provider &&
      connected && // Only try if connected
      !hasTriedInit &&
      initializeMutation.status !== 'pending' &&
      initializeMutation.status !== 'success'
    ) {
      initializeMutation.mutate();
      setHasTriedInit(true);
    }
  }, [program, provider, connected, initializeMutation, hasTriedInit]);

  return (
    <div className="space-y-6 text-center max-w-4xl mx-auto py-8">
      <h1 className="text-4xl md:text-5xl font-bold">Anaheim Community Console</h1>
      <p className="text-lg text-muted-foreground">
        Connect your wallet to interact with the on-chain program.
      </p>

      {/* Show a clear status of the program initialization */}
      <div className="p-4 border rounded-lg bg-card">
        <p className="font-semibold">Program Initialization Status:</p>
        <p className="text-muted-foreground text-sm">
          {
            initializeMutation.isPending ? '⏳ Initialization in progress...' :
              initializeMutation.isError ? `❌ Error: ${initializeMutation.error?.message}` :
                initializeMutation.isSuccess ? '✅ Initialized successfully!' :
                  'Not initialized'
          }
        </p>
      </div>

      {/* Show connect button if wallet is not connected */}
      {!connected && (
        <div className="flex justify-center">
          <ClientWalletMultiButton />
        </div>
      )}

      {/* Explicit initialize button if needed */}
      {connected && !initializeMutation.isSuccess && (
        <button
          onClick={() => initializeMutation.mutate()}
          disabled={initializeMutation.isPending}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {initializeMutation.isPending ? 'Initializing...' : 'Initialize Program'}
        </button>
      )}

      {/* Main content, only shown when connected and initialized */}
      {connected && initializeMutation.isSuccess && (
        <ClientOnly>
          <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4 border-t">
            <MiningClient />
            <TransferSolFeature />
          </div>
        </ClientOnly>
      )}
    </div>
  );
}