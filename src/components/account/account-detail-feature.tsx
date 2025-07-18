// FILE: src/components/account/account-detail-feature.tsx
'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// --- Corrected Library Imports ---
import { assertIsAddress, Lamports } from 'gill';
// FIX: Import the standard 'useConnection' hook and 'PublicKey' class.
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// --- Local Component Imports ---
import AccountUI from './account-ui';
import { AccountButtons } from './AccountButtons';
import { AccountTransactions } from './AccountTransactions';
import { AppAlert } from '../app-alert';
import { Button } from '../ui/button';
import { ellipsify } from '@/lib/utils';

// HOOK: For requesting an airdrop (now uses standard 'useConnection')
function useAirdropMutation(address: string) {
  // FIX: Get the raw connection object directly.
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['airdrop', address],
    mutationFn: async (amount: number = 1) => {
      assertIsAddress(address);
      try {
        const lamportsToRequest = (amount * LAMPORTS_PER_SOL) as unknown as Lamports;
        // FIX: Use the standard 'requestAirdrop' method from the connection object.
        const signature = await connection.requestAirdrop(new PublicKey(address), lamportsToRequest);
        await connection.confirmTransaction(signature, 'confirmed'); // Wait for confirmation
        console.log(`Airdrop confirmed: ${signature}`);
        return signature;
      } catch (error) {
        console.error('Airdrop failed', error);
        throw new Error('Airdrop failed');
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['balance', address] });
    },
  });
}

// HOOK: For getting the account balance (now uses standard 'useConnection')
function useGetBalance(address: string) {
  // FIX: Get the raw connection object directly.
  const { connection } = useConnection();

  return useQuery({
    queryKey: ['balance', address],
    enabled: !!address,
    queryFn: async () => {
      assertIsAddress(address);
      // FIX: Use the standard 'getAccountInfo' method from the connection object.
      const accountInfo = await connection.getAccountInfo(new PublicKey(address));
      if (!accountInfo) {
        throw new Error('Account not found');
      }
      return accountInfo.lamports / LAMPORTS_PER_SOL;
    },
    retry: false,
  });
}

// (The rest of the file remains the same)

// COMPONENT: Displays the balance using the hook
const AccountBalance: React.FC<{ address: string }> = ({ address }) => {
  const { data, isLoading } = useGetBalance(address);
  if (isLoading) return <span className="text-muted">Loading Balance…</span>;
  return <span>{(data ?? 0).toFixed(4)} SOL</span>;
};

// COMPONENT: Placeholder for token list
const AccountTokens: React.FC<{ address: string }> = ({ address }) => {
  return <div>Tokens for {ellipsify(address)}</div>;
};

// --- MAIN FEATURE COMPONENT ---
export default function AccountDetailFeature() {
  const params = useParams();
  const address = useMemo(() => {
    const addr = params.address;
    if (!addr || typeof addr !== 'string') return undefined;
    try { assertIsAddress(addr); return addr; } catch (e) { return undefined; }
  }, [params.address]);

  const balanceQuery = useGetBalance(address || '');
  const airdropMutation = useAirdropMutation(address || '');

  if (!address) {
    return (
        <div className="container py-10">
          <AppAlert action={null}><p className="text-center">Invalid address provided in the URL.</p></AppAlert>
        </div>
    );
  }

  if (balanceQuery.isLoading) {
    return <div className="p-10 text-center">Loading account details...</div>;
  }

  if (balanceQuery.isError) {
    return (
        <div className="container py-10">
          <AppAlert
              action={
                <Button variant="outline" onClick={() => airdropMutation.mutate(1)} disabled={airdropMutation.isPending}>
                  {airdropMutation.isPending ? 'Requesting...' : 'Request 1 SOL Airdrop'}
                </Button>
              }
          >
            <div className="space-y-2 text-center">
              <h3 className="font-bold text-lg">Account Not Found</h3>
              <p>The account {ellipsify(address)} does not exist on this network.</p>
            </div>
          </AppAlert>
        </div>
    );
  }

  return (
      <AccountUI
          address={address}
          label="Account Details"
          balance={<AccountBalance address={address} />}
          actions={<AccountButtons address={address} />}
      >
        <div className="space-y-8">
          <AccountTokens address={address} />
          <AccountTransactions address={address} />
        </div>
      </AccountUI>
  );
}