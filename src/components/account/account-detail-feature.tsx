// FILE: src/components/account/account-detail-feature.tsx
'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { assertIsAddress } from '@solana/addresses';

// --- Local Component Imports ---
import AccountUI from './account-ui';
import { AccountButtons } from './AccountButtons';
import { AccountTransactions } from './AccountTransactions';
import { AppAlert } from '../app-alert';
import { Button } from '../ui/button';
import { ellipsify } from '@/lib/utils';

// HOOK: For requesting an airdrop.
function useAirdropMutation(address: string) {
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['airdrop', address],
    mutationFn: async (amount: number = 1) => {
      assertIsAddress(address);
      try {
        const lamportsToRequest = amount * LAMPORTS_PER_SOL;
        const signature = await connection.requestAirdrop(new PublicKey(address), lamportsToRequest);
        const blockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature,
          ...blockhash,
        }, 'confirmed');
        console.log(`Airdrop confirmed: ${signature}`);
        return signature;
      } catch (error) {
        console.error('Airdrop failed', error);
        throw new Error('Airdrop failed');
      }
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['balance', address] });
    },
  });
}

// HOOK: For getting the account balance.
function useGetBalance(address: string) {
  const { connection } = useConnection();
  return useQuery({
    queryKey: ['balance', address],
    enabled: !!address,
    queryFn: async () => {
      assertIsAddress(address);
      const accountInfo = await connection.getAccountInfo(new PublicKey(address));
      if (!accountInfo) {
        throw new Error('Account not found');
      }
      return accountInfo.lamports / LAMPORTS_PER_SOL;
    },
    retry: false,
  });
}

// ===================================================================
// THIS IS THE DEFINITIVE FIX FOR THE CRASH.
// The placeholder comments have been replaced with the full, correct
// component code, including the essential `return` statements.
// ===================================================================

// COMPONENT: Displays the balance using the hook.
const AccountBalance: React.FC<{ address: string }> = ({ address }) => {
  const { data, isLoading } = useGetBalance(address);
  if (isLoading) {
    return <span className="text-muted">Loading Balance…</span>;
  }
  return <span>{(data ?? 0).toFixed(4)} SOL</span>;
};

// COMPONENT: Placeholder for token list.
const AccountTokens: React.FC<{ address: string }> = ({ address }) => {
  // This component now correctly uses the 'address' prop, fixing the linter warning.
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
    return <AppAlert action={null}><p className="text-center">Invalid address provided in the URL.</p></AppAlert>;
  }

  if (balanceQuery.isLoading) {
    return <div className="p-10 text-center">Loading account details...</div>;
  }

  if (balanceQuery.isError) {
    return (
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