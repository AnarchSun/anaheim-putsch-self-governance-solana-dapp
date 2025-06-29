'use client'

import React from 'react'
import { useWalletUi } from '@/hooks/wallet/wallet-hooks'

export default function HomePage() {
  const { address, cluster } = useWalletUi()

  return (
    <main className="p-8 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
        Bienvenue dans le Putsch dApp
      </h1>
      <p className="mb-4">
        Adresse Wallet connectée : <code>{address ?? 'Non connecté'}</code>
      </p>
      <p className="mb-8">
        Cluster actif : <strong>{cluster}</strong>
      </p>

      <section className="border rounded p-6 bg-neutral-100 dark:bg-neutral-900">
        <h2 className="text-2xl font-semibold mb-3">Fractal Governance</h2>
        <p>
          Ici s’entrelacent révolution, magie et code. Ton interaction
          forge les chemins fractals de l’autogestion.
        </p>
      </section>
    </main>
  )
}
