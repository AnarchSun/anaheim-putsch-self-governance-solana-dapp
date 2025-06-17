//
import React, { ReactNode } from 'react'
import { ClusterChecker } from './ClusterChecker'

export default function ClientClusterUI({ children }: { children?: ReactNode }) {
  return <ClusterChecker>{children}</ClusterChecker>
}
