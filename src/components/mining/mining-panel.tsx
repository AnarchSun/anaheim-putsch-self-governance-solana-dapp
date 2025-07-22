// FILE: src/components/mining/mining-panel.tsx
'use client';

import React from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getAnaheimAccount, ANAHEIM_ACCOUNT_PUBKEY, ANAHEIM_PROGRAM_ID } from '@/lib/anaheim-program';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { IDL, Anaheim } from '@/lib/idl/anaheim';
import { AppAlert } from '../app-alert';
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider';

// Custom hook to fetch the Anaheim account data.
function useAnaheimAccountQuery() {
  const { connection } = useConnection();
  return useQuery({
    queryKey: ['anaheim-account'],
    queryFn: () => getAnaheimAccount(connection),
  });
}

// Custom hook for the 'increment' transaction.
function useIncrementMutation() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet is not connected or ready for signing.');
      }

      const provider = new AnchorProvider(connection, wallet as unknown as Wallet, AnchorProvider.defaultOptions());

      // ===================================================================
      // THIS IS THE DEFINITIVE FIX FOR THE CRASH.
      // 1. We manually set the program's address on the imported IDL object.
      // 2. We use the correct two-argument constructor: new Program(IDL, provider).
      // This resolves the TS2345 error permanently.
      // ===================================================================
      IDL.address = ANAHEIM_PROGRAM_ID.toBase58();
      const program = new Program<Anaheim>(IDL, provider);

      const signature = await program.methods
          .increment()
          .accounts({ anaheim: ANAHEIM_ACCOUNT_PUBKEY! })
          .rpc();

      const blockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        ...blockhash,
      }, 'confirmed');

      return signature;
    },
    onSuccess: (signature) => {
      console.log(`Increment successful! Signature: ${signature}`);
      return queryClient.invalidateQueries({ queryKey: ['anaheim-account'] });
    },
    onError: (error: Error) => {
      console.error('Increment transaction failed:', error.message);
    },
  });
}

// This is the main UI element for the mining page.
export default function MiningPanel() {
  const { connected } = useWallet();
  const { data: anaheimAccount, isLoading } = useAnaheimAccountQuery();
  const incrementMutation = useIncrementMutation();

  if (!ANAHEIM_ACCOUNT_PUBKEY) {
    // This alert now correctly includes the 'action={null}' prop.
    return (
        <AppAlert action={null}>
          <div className="text-center font-semibold text-red-500">
            <p>Configuration Error</p>
            <p className="text-sm font-normal text-muted-foreground">
              The Anaheim Account Public Key is missing from your `.env.local` file.
            </p>
          </div>
        </AppAlert>
    );
  }

  if (isLoading) {
    return <div className="p-4 border rounded-xl bg-card text-card-foreground max-w-sm mx-auto">Loading Program State...</div>;
  }

  if (!anaheimAccount) {
    return <div className="p-4 border rounded-xl bg-destructive text-destructive-foreground max-w-sm mx-auto">Error: Anaheim program account not found. Please run the initialize script.</div>;
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