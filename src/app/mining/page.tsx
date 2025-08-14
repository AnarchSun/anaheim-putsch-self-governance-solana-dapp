// FILE: src/app/mining/page.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';
import MiningClient from '@/components/mining/MiningClient';
import { TransferSolFeature } from '@/components/account/account-data-access'; // Assuming this component exists
import { ClientOnly } from '@/components/ClientOnly';
import { useInitializeMutation } from '@/hooks/useInitialize'; // Correctly import the new hook
import { useAnaheimProgram } from '@/hooks/useProgram';

export default function HomePage() {
  const { connected } = useWallet();
  const { program, provider } = useAnaheimProgram();

  // FIX: Call the correct mutation hook.
  const initializeMutation = useInitializeMutation();

  const [hasTriedInit, setHasTriedInit] = React.useState(false);

  React.useEffect(() => {
    // ... (Your useEffect logic remains the same and is excellent for debugging) ...
    console.log("Checking conditions to auto-initialize...");
    console.log("Is connected?", connected);
    console.log("Has program loaded?", !!program);
    console.log("Has provider loaded?", !!provider);
    console.log("Has already tried init?", hasTriedInit);
    console.log("Mutation status:", initializeMutation.status);

    if (program && provider && connected && !hasTriedInit && initializeMutation.status === 'idle') {
      console.log("✅ Conditions met. Automatically calling initializeMutation.mutate()...");
      initializeMutation.mutate();
      setHasTriedInit(true);
    } else {
      console.log("❌ Conditions not met. Not auto-initializing.");
    }
  }, [program, provider, connected, initializeMutation, hasTriedInit]);

  return (
      // ... (Your JSX remains the same and is very well structured) ...
      <div className="space-y-6 text-center max-w-4xl mx-auto py-8">
        <h1 className="text-4xl md:text-5xl font-bold">Anaheim Community Console</h1>
        <p className="text-lg text-muted-foreground">
          Connect your wallet to interact with the on-chain program.
        </p>

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

        {!connected && (
            <div className="flex justify-center">
              <ClientWalletMultiButton />
            </div>
        )}

        {connected && !initializeMutation.isSuccess && (
            <button
                onClick={() => initializeMutation.mutate()}
                disabled={initializeMutation.isPending}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {initializeMutation.isPending ? 'Initializing...' : 'Initialize Program'}
            </button>
        )}

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