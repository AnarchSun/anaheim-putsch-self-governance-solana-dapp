// FILE: src/components/account/account-detail-feature.tsx
'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { assertIsAddress } from '@solana/addresses';
import { ellipsify } from '@/lib/utils';
import { AppAlert } from '../app-alert';
import { Button } from '../ui/button';
import AccountUI from './account-ui';
import { AccountButtons } from './AccountButtons';
import { AccountTransactions } from './AccountTransactions';

// --- HOOK: Airdrop 1 SOL ---
function useAirdropMutation(address: string) {
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['airdrop', address],
    mutationFn: async (amount: number = 1) => {
      assertIsAddress(address);
      const lamports = amount * LAMPORTS_PER_SOL;
      const sig = await connection.requestAirdrop(new PublicKey(address), lamports);
      const blockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature: sig, ...blockhash }, 'confirmed');
      return sig;
    },
    onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['balance', address] }),
  });
}

// --- HOOK: Account Balance ---
function useGetBalance(address: string) {
  const { connection } = useConnection();
  return useQuery({
    queryKey: ['balance', address],
    enabled: !!address,
    queryFn: async () => {
      assertIsAddress(address);
      const info = await connection.getAccountInfo(new PublicKey(address));
      if (!info) throw new Error('Account not found');
      return info.lamports / LAMPORTS_PER_SOL;
    },
    retry: false,
  });
}

const AccountBalance: React.FC<{ address: string }> = ({ address }) => {
  const { data, isLoading } = useGetBalance(address);
  return (
      <span>{isLoading ? 'Loading Balance…' : `${(data ?? 0).toFixed(4)} SOL`}</span>
  );
};

const AccountTokens: React.FC<{ address: string }> = ({ address }) => (
    <div>Tokens for {ellipsify(address)}</div>
);

// --- MAIN COMPONENT ---
export default function AccountDetailFeature() {
  const params = useParams();
  const address = useMemo(() => {
    const addr = params.address;
    if (!addr || typeof addr !== 'string') return undefined;
    try {
      assertIsAddress(addr);
      return addr;
    } catch {
      return undefined; // variable 'e' removed
    }
  }, [params.address]);

  const balanceQuery = useGetBalance(address || '');
  const airdrop = useAirdropMutation(address || '');

  if (!address) {
    return (
        <AppAlert action={null}>
          <p className="text-center">Invalid address provided in the URL.</p>
        </AppAlert>
    );
  }

  if (balanceQuery.isLoading) {
    return <div className="p-10 text-center">Loading account details…</div>;
  }

  if (balanceQuery.isError) {
    return (
        <AppAlert
            action={
              <Button
                  variant="outline"
                  onClick={() => airdrop.mutate(1)}
                  disabled={airdrop.isPending}
              >
                {airdrop.isPending ? 'Requesting…' : 'Request 1 SOL Airdrop'}
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
