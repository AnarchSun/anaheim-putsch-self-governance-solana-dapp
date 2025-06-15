import React from 'react'
import { DashboardFeature } from '@/components/dashboard/dashboard-feature'
import { DebugConstants } from '@/components/DebugConstants'
import { Rapper } from '@/components/rapper'

export default function Home() {
  return (
    <main>
      <h1>Bienvenue dans Anaheim Putsch</h1>
      <Rapper />
      <DashboardFeature />
      <DebugConstants />
    </main>
  )
}
