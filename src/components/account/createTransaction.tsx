// src/components/account/createTransaction.tsx
// src/components/account/createTransaction.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'

const RPC_ENDPOINT = 'https://api.devnet.solana.com'

interface CreateTransactionProps {
  recipientAddress: string
  connection?: Connection  // Typage précis, pas any
}

export function CreateTransaction({ recipientAddress, connection: externalConnection }: CreateTransactionProps) {
  const { publicKey, sendTransaction } = useWallet()
  const [connection, setConnection] = useState<Connection | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!externalConnection) {
      setConnection(new Connection(RPC_ENDPOINT))
    } else {
      setConnection(externalConnection)
    }
  }, [externalConnection])

  async function handleCreateTransaction() {
    if (!publicKey) {
      setStatus('Connecte ton wallet d’abord.')
      return
    }
    if (!connection) {
      setStatus('Connexion RPC non initialisée.')
      return
    }

    try {
      setLoading(true)
      setStatus('Création de la transaction...')

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: LAMPORTS_PER_SOL / 100, // 0.01 SOL
        }),
      )

      const latest = await connection.getLatestBlockhash()
      transaction.recentBlockhash = latest.blockhash
      transaction.feePayer = publicKey

      const signature = await sendTransaction(transaction, connection)
      setStatus(`Transaction envoyée : ${signature}`)

      await connection.confirmTransaction(
        {
          signature,
          blockhash: latest.blockhash,
          lastValidBlockHeight: latest.lastValidBlockHeight,
        },
        'confirmed'
      )

      setStatus(`Transaction confirmée : ${signature}`)
    } catch (error) {
      console.error(error)
      setStatus(`Erreur: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md max-w-md mx-auto">
      <button
        disabled={loading}
        onClick={handleCreateTransaction}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
      >
        {loading ? 'Envoi en cours...' : 'Créer et Envoyer Transaction'}
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  )
}
