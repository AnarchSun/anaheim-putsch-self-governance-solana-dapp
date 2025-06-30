// src/app/stake/page.tsx
'use client' // 👈 OBLIGATOIRE EN HAUT POUR USEEFFECT

import { useEffect, useState } from 'react'
import { Connection, PublicKey, GetStakeActivationConfig } from '@solana/web3.js'

export default function StakeActivationPage() {
  const [status, setStatus] = useState<string>('Chargement...')
  const pubkey = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')

  useEffect(() => {
    const fetchActivation = async () => {
      const connection = new Connection('https://api.devnet.solana.com')
      try {
        const activation = await connection.getStakeActivation(pubkey as PublicKey, {} as GetStakeActivationConfig)
        console.log('Activation:', activation)
        setStatus(`État du staking: ${activation.state}, actif: ${activation.active}, inactif: ${activation.inactive}`)
      } catch (e) {
        console.error('Erreur:', e)
        setStatus('Erreur lors de la récupération du statut')
      }
    }

    fetchActivation()
  }, [pubkey])

  return (
    <div className="p-6 bg-neutral-900 text-white rounded-xl shadow-lg border border-white/10 max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">🧪 Vérification du staking</h1>
      <p>{status}</p>
    </div>
  )
}
