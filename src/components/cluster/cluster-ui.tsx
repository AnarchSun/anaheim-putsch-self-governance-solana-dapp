import { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'
import { useSolanaClient } from 'gill-react'
import { useWalletUi, useWalletUiCluster } from '@/hooks/wallet/wallet-hooks'

// ✅ Composant fonctionnel React
export function ExplorerLink({ address, label }: { address: string, label?: string }) {
  return (
    <a
      href={`https://explorer.solana.com/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      {label ?? address}
    </a>
  )
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const cluster = useWalletUiCluster()
  const client = useSolanaClient()

  const label = (cluster as any)?.label ?? 'unknown'
  const endpoint = (cluster as any)?.urlOrMoniker ?? 'unknown'

  const query = useQuery({
    queryKey: ['version', { cluster: label, endpoint }],
    queryFn: () => client?.rpc.getVersion(),
    enabled: !!client,
    retry: 1,
  })

  if (!client || query.isLoading) return null

  if (query.isError || !query.data) {
    return (
      <AppAlert
        action={
          <Button variant="outline" onClick={() => query.refetch()}>
            Refresh
          </Button>
        }
      >
        Error connecting to cluster <span className="font-bold">{label}</span>.
      </AppAlert>
    )
  }

  return <>{children}</>
}
