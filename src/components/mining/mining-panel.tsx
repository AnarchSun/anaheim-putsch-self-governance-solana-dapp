'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatDistanceToNowStrict } from 'date-fns'
import { add } from 'date-fns'

// Simule une récompense minée (sera remplacé plus tard par un vrai call on-chain)
function claimReward(walletAddress: string): Promise<number> {
  return new Promise((resolve) => {
    const simulatedAmount = 0.357
    setTimeout(() => {
      console.log('Récompense envoyée à :', walletAddress)
      resolve(simulatedAmount)
    }, 500)
  })
}

const LAST_CLAIM_KEY = 'last-claim-timestamp'
const ONE_DAY_MS = 24 * 60 * 60 * 1000

function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

export default function MiningPanel() {
  const { publicKey, connected } = useWallet()

  const [lastClaim, setLastClaim] = useState<Date | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [canClaim, setCanClaim] = useState(false)
  const [rewardAmount, setRewardAmount] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)

    try {
      const stored = localStorage.getItem(LAST_CLAIM_KEY)
      if (stored) {
        const date = new Date(stored)
        if (isValidDate(date)) setLastClaim(date)
        else localStorage.removeItem(LAST_CLAIM_KEY)
      }
    } catch (e) {
      console.error('Erreur avec localStorage', e)
    } finally {
      setIsInitialized(true)
    }

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (lastClaim) {
      setCanClaim(now - lastClaim.getTime() > ONE_DAY_MS)
    } else {
      setCanClaim(true)
    }
  }, [lastClaim, now])

  useEffect(() => {
    if (lastClaim) localStorage.setItem(LAST_CLAIM_KEY, lastClaim.toISOString())
  }, [lastClaim])

  const displayText = useMemo(() => {
    if (!connected) return 'Connecte ton portefeuille pour miner'
    if (!isInitialized) return 'Chargement...'
    if (!lastClaim) return 'Pas encore de minage effectué'
    return `Dernier minage : ${formatDistanceToNowStrict(lastClaim, { locale: fr })}`
  }, [isInitialized, lastClaim, connected])

  const nextClaimIn = useMemo(() => {
    if (!lastClaim || canClaim) return null
    const nextClaimDate = add(lastClaim, { days: 1 })
    return formatDistance(new Date(), nextClaimDate, { addSuffix: true, locale: fr })
  }, [lastClaim, canClaim])

  const progress = useMemo(() => {
    if (!lastClaim) return 100
    const elapsed = now - lastClaim.getTime()
    return Math.min(100, Math.round((elapsed / ONE_DAY_MS) * 100))
  }, [lastClaim, now])

  const handleClaim = async () => {
    if (!publicKey) return
    if (!canClaim) return

    try {
      const amount = await claimReward(publicKey.toBase58())
      setRewardAmount(amount)
      setLastClaim(new Date())
    } catch (error) {
      console.error('Erreur lors de la réclamation :', error)
    }
  }

  return (
    <div className="p-4 border rounded-xl bg-gray-900 text-white space-y-3 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Panneau de Minage</h2>

      {rewardAmount !== null && (
        <p className="text-green-400 font-semibold text-center animate-pulse">+{rewardAmount} r=3.57 miné!</p>
      )}

      <p className={`text-red-500 font-bold ${canClaim ? 'animate-pulse' : ''}`}>{displayText}</p>

      {!canClaim && nextClaimIn && <p className="text-sm text-gray-400">Prochaine réclamation : {nextClaimIn}</p>}

      <div className="h-2 bg-gray-700 rounded overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        className={`w-full px-4 py-2 rounded font-semibold transition-all ${
          connected && canClaim ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
        }`}
        onClick={handleClaim}
        disabled={!connected || !canClaim}
      >
        {connected ? (canClaim ? 'Réclamer' : 'Reviens plus tard') : 'Connecte ton wallet'}
      </button>
    </div>
  )
}
