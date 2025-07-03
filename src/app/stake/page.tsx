// src/pages/stakePage.tsx (ou où tu veux)

import { StakeWatcher } from '@/components/stake/StakeWatcher'
import { DebugStakeStatus } from '@/hooks/stake/debugStakeStatus'

export default function Page() {
  return (
    <main>
      <div>
        <StakeWatcher address="8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX" />
      </div>
      <h1>Debug Stake</h1>
      <DebugStakeStatus />
    </main>
  )
}

