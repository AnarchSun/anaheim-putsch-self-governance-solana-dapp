// src/hooks/useGetSignatures.ts
import { useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@/hooks/wallet/wallet-hooks'
import { Address } from '@solana/kit' // ✅ source réelle du type Address

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
  const { client } = useWalletUi() as unknown as WalletUiReturn

  return useQuery({
    queryKey: ['get-signatures', { address }],
    queryFn: async () => {
      if (!client?.rpc?.getSignaturesForAddress) {
        throw new Error('client.rpc.getSignaturesForAddress is undefined')
      }
      return client.rpc.getSignaturesForAddress(address).send()
    },
    enabled: !!address,
  })
}
