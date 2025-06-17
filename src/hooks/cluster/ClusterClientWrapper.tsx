'use client'

import dynamic from 'next/dynamic'

const ClusterUI = dynamic(
  () => import('@/components/cluster/cluster-ui').then((m) => m.ClusterChecker),
  { ssr: false }
)

export function ClusterClientWrapper({ children }: { children?: React.ReactNode }) {
  return <ClusterUI>{children}</ClusterUI>
}
