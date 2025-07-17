// FILE: src/components/account/account-detail-feature.tsx
'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// --- Corrected Library Imports ---
import { assertIsAddress } from '@solana/addresses';
import { Lamports } from 'gill'; // FIX: Lamports is now imported from 'gill'
import { useSolanaClient } from 'gill-react';

// --- Corrected Local Component Imports ---
import AccountUI from './account-ui'; // FIX: Use default import for AccountUI
import { AccountButtons } from './AccountButtons';
import { AccountTransactions } from './AccountTransactions';
import { AppAlert } from '../app-alert';
import { Button } from '../ui/button';

// --- Utility and Constant Imports ---
import { ellipsify } from '@/lib/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// HOOK: For requesting an airdrop
function useAirdropMutation(address: string) {
  const client = useSolanaClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['airdrop', address],
    mutationFn: async (amount: number = 1) => {
      assertIsAddress(address);
      try {
        const lamportsToRequest = (amount * LAMPORTS_PER_SOL) as unknown as Lamports;
        const signature = await client.rpc
            .requestAirdrop(address, lamportsToRequest)
            .send();

        console.log(`Airdrop requested: ${signature}`);
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

// HOOK: For getting the account balance
function useGetBalance(address: string) {
  const client = useSolanaClient();

  return useQuery({
    queryKey: ['balance', address],
    enabled: !!address,
    queryFn: async () => {
      assertIsAddress(address);
      const accountInfo = await client.rpc.getAccountInfo(address).send();
      if (!accountInfo.value) {
        throw new Error('Account not found');
      }
      return Number(accountInfo.value.lamports) / LAMPORTS_PER_SOL;
    },
    retry: false,
  });
}

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
    try {
      assertIsAddress(addr);
      return addr;
    } catch (e) {
      return undefined;
    }
  }, [params.address]);

  const balanceQuery = useGetBalance(address || '');
  const airdropMutation = useAirdropMutation(address || '');

  // 1. Handle case where an address is invalid or not provided in URL
  if (!address) {
    return (
        <div className="container py-10">
          <AppAlert action={null}>
            <p className="text-center">Invalid address provided in the URL.</p>
          </AppAlert>
        </div>
    );
  }

  // 2. Handle loading state
  if (balanceQuery.isLoading) {
    return <div className="p-10 text-center">Loading account details...</div>;
  }

  // 3. Handle error state (account not found) by showing the airdrop UI
  if (balanceQuery.isError) {
    return (
        <div className="container py-10">
          <AppAlert
              action={
                <Button
                    variant="outline"
                    onClick={() => airdropMutation.mutate(1)}
                    disabled={airdropMutation.isPending}
                >
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

  // 4. Handle success state: Render the full AccountUI
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