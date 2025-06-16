import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'

// Assume these are React hooks that return the expected data
import { useSolanaClient } from 'gill-react'
import { useWalletUi, useWalletUiCluster } from '@/hooks/wallet/wallet-hooks.ts'

const { client } = useWalletUi()

// Si tu ne l’utilises pas encore, garde-le vivant en l’affichant dans la console :
console.log('wallet client:', client)

export function ClusterChecker({ children }: { children: ReactNode }) {
  // Hooks React, pas des schémas
  const walletUi = useWalletUi()
  const cluster = useWalletUiCluster()

  // Ici client doit être un objet avec propriété `rpc`
  const client = useSolanaClient()

  if (!client) {
    return (
      <AppAlert action={<Button variant="outline">Retry</Button>}>
        Solana client unavailable — connection impossible.
      </AppAlert>
    )
  }

  // Prends garde aux propriétés de cluster
  const label = (cluster as any)?.label ?? 'unknown'
  const endpoint = (cluster as any)?.urlOrMoniker ?? 'unknown'

  const query = useQuery({
    queryKey: ['version', { cluster: label, endpoint }],
    queryFn: () => client.rpc.getVersion(),
    retry: 1,
  })

  if (query.isLoading) return null

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

export class ClusterDisplay {
}
