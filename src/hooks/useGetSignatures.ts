// hooks/useGetSignatures.ts
import { useQuery } from '@tanstack/react-query'
import { Address } from '@/hooks/solana/useGetBalance'
import { useWalletUi, useWalletUiCluster } from './wallet/wallet-hooks.ts'
import cluster from 'node:cluster'

interface WalletUiRpc {
  getSignaturesForAddress: (address: Address) => {
    send: () => Promise<unknown>
  }
}

interface WalletUiReturn {
  client: {
    rpc: WalletUiRpc
  }
}

export function useGetSignatures({ address }: { address: Address }) {
  const { client } = useWalletUi () as unknown as WalletUiReturn


  if (!client?.rpc?.getSignaturesForAddress) {
    throw new Error('client.rpc.getSignaturesForAddress is undefined')
  }

  return useQuery({
    queryKey: ['get-signatures', { cluster, address }],
    queryFn: () => client.rpc.getSignaturesForAddress(address).send(),
  })
}
