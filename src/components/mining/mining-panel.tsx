// FILE: src/components/mining/mining-panel.tsx
'use client';

import React from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getAnaheimAccount, ANAHEIM_ACCOUNT_PUBKEY } from '@/lib/anaheim-program';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { IDL, Anaheim } from '@/lib/idl/anaheim';

function useAnaheimAccountQuery() {
  const { connection } = useConnection();
  return useQuery({ queryKey: ['anaheim-account'], queryFn: () => getAnaheimAccount(connection) });
}

function useIncrementMutation() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Step 1: Use a "type guard" to ensure the wallet is ready at runtime.
      if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
        throw new Error('Wallet is not connected or ready for signing transactions.');
      }

      // Step 2: Use the "double cast" (`as unknown as Wallet`) as required by TypeScript.
      // This is a forceful type assertion that tells the compiler we guarantee the `wallet`
      // object's shape is compatible with the `Wallet` interface at this point.
      const provider = new AnchorProvider(connection, wallet as unknown as Wallet, AnchorProvider.defaultOptions());

      // Step 3: Use the correct Program constructor.
      const program = new Program<Anaheim>(IDL, provider);

      const signature = await program.methods
          .increment()
          .accounts({ anaheim: ANAHEIM_ACCOUNT_PUBKEY })
          .rpc();

      const blockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
      }, 'confirmed');

      return signature;
    },
    onSuccess: (signature) => {
      console.log(`Increment successful! Signature: ${signature}`);
      void queryClient.invalidateQueries({ queryKey: ['anaheim-account'] });
    },
    onError: (error) => {
      console.error('Increment transaction failed', error);
    },
  });
}

export default function MiningPanel() {
  const { connected } = useWallet();
  const { data: anaheimAccount, isLoading } = useAnaheimAccountQuery();
  const incrementMutation = useIncrementMutation();

  if (isLoading) {
    return <div className="p-4 border rounded-xl bg-card text-card-foreground max-w-sm mx-auto">Loading Program State...</div>;
  }

  if (!anaheimAccount) {
    return <div className="p-4 border rounded-xl bg-destructive text-destructive-foreground max-w-sm mx-auto">Error: Anaheim program account not found. Please initialize it.</div>;
  }

  const currentCount = anaheimAccount.count.toNumber();

  return (
      <div className="p-6 border rounded-xl bg-card text-card-foreground space-y-4 max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-center">Community Counter</h2>
        <div className="text-center">
          <p className="text-muted-foreground">Current Count:</p>
          <p className="text-5xl font-bold font-mono animate-pulse">{currentCount}</p>
        </div>
        <Button
            className="w-full text-lg py-6"
            onClick={() => incrementMutation.mutate()}
            disabled={!connected || incrementMutation.isPending}
        >
          { !connected ? 'Connect Wallet to Participate' : (incrementMutation.isPending ? 'Incrementing...' : 'Increment Count') }
        </Button>
      </div>
  );
}