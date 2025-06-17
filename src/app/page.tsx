'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Charger dynamiquement ClusterChecker sans SSR
const ClusterChecker = dynamic(
  () => import('../components/cluster/cluster-ui').then((mod) => mod.ClusterChecker),
  { ssr: false }
)

type ClientClusterUIProps = {
  children?: ReactNode
}

export default function ClientClusterUI({ children }: ClientClusterUIProps) {
  return (
    <ClusterChecker>
      {children}
    </ClusterChecker>
  )
}
