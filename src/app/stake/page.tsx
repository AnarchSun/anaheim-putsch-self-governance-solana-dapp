import React from 'react'
import { StakeWatcher } from '@/app/stake/stake-wtache' // Chemin vers ton composant
import { Connection, PublicKey } from '@solana/web3.js'

// Program IDs sur devnet (tes adresses réelles)
const PROGRAM_ANAHEIM = new PublicKey("DjSdHpSGjPqWFSZuNDDFas2dVrdfrMVTir1xJgQyjLFT")
const PROGRAM_JOURNAL = new PublicKey("AC2NZK3Xg6HvsZdG1hc3fdWmmgqn2t9ohKHsueZacTgu")

// L'adresse publique de l'utilisateur, à remplacer par la vraie
const USER_ADDRESS = "TonAdressePubliqueSolanaIci"

const connection = new Connection("https://api.devnet.solana.com")

export default function StakeDashboard() {
  return (
    <div>
      <h1>Surveillance du Stake</h1>

      <h2>Programme Anaheim</h2>
      <StakeWatcher
        address={USER_ADDRESS}
        connection={connection}
        programId={PROGRAM_ANAHEIM}
      />

      <h2>Programme Journal</h2>
      <StakeWatcher
        address={USER_ADDRESS}
        connection={connection}
        programId={PROGRAM_JOURNAL}
      />
    </div>
  )
}
