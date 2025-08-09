// src/hooks/solana/useSolanaClient.ts
import { useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { createSolanaClient, type Address } from 'gill'

const clusterToMoniker = (cluster: string) => {
  if (cluster === 'devnet') return 'devnet';
  if (cluster === 'mainnet') return 'mainnet';
  if (cluster === 'testnet') return 'testnet';
  return 'mainnet'; // fallback
}

export function useSolanaClient() {
  const { cluster } = useWalletUi();
  const moniker = clusterToMoniker(cluster);

  const client = createSolanaClient({ urlOrMoniker: moniker });
  return { client };
}

export function useGetBalanceQuery({ address }: { address: Address }) {
  const { cluster } = useWalletUi();
  const { client } = useSolanaClient();

  return useQuery({
    queryKey: ['get-balance', { cluster, address }],
    queryFn: () => client.rpc.getBalance(address).send(),
  });
}
