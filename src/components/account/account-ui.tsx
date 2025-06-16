// src/components/account/account-ui.ts
'use client'

import React, { useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { AppModal } from '../app-modal'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

// Typage clair de l'adresse sous forme string
type Address = string

// Définition du payload attendu par la mutation
interface TransferPayload {
  to: Address
  amount: number
}

// Simule ta fonction d’envoi de SOL, à remplacer par ta vraie logique Solana
async function transferSol({ to, amount }: TransferPayload): Promise<string> {
  // Implémenter la vraie transaction Solana ici
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return `Transfer of ${amount} SOL to ${to} succeeded`
}

// Hook personnalisé qui utilise react-query useMutation
function useTransferSol() {
  return useMutation<string, Error, TransferPayload>({
    mutationFn: transferSol,
  })
}

interface AccountUIProps {
  address?: Address
  account?: PublicKey
}

export function AccountUI(props: AccountUIProps) {
  const mutation = useTransferSol()

  const [destination, setDestination] = useState<string>('')
  const [amount, setAmount] = useState<string>('1')

  // Validation simple des champs
  const isValidAddress = (addr: string) => {
    try {
      new PublicKey(addr)
      return true
    } catch {
      return false
    }
  }

  // Le vrai état "loading" = 'pending'
  const isPending = mutation.status === 'pending'

  const isSubmitDisabled =
    isPending || !destination || !isValidAddress(destination) || Number.isNaN(Number(amount)) || Number(amount) <= 0

  if (!props.address || !props.account) {
    return <div>Wallet not connected</div>
  }

  return (
    <AppModal
      title="Send SOL"
      submitDisabled={isSubmitDisabled}
      submitLabel="Send"
      submit={async () => {
        if (!isValidAddress(destination)) return
        await mutation.mutateAsync({
          to: destination,
          amount: Number(amount),
        })
        setDestination('')
        setAmount('1')
      }}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        id="destination"
        disabled={isPending}
        value={destination}
        onChange={(e) => setDestination(e.target.value.trim())}
        placeholder="Enter destination address"
        type="text"
      />

      <Label htmlFor="amount">Amount (SOL)</Label>
      <Input
        id="amount"
        disabled={isPending}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        type="number"
        min="0.0000001"
        step="any"
      />

      {mutation.isError && <div style={{ color: 'red', marginTop: 8 }}>Error: {mutation.error?.message}</div>}

      {mutation.isSuccess && <div style={{ color: 'green', marginTop: 8 }}>Success: {mutation.data}</div>}
    </AppModal>
  )
}

export class AccountChecker {}

export class AccountBalance {
  constructor(param: { address: string }) {
    // TODO MY SWEEETHEART..
  }

}

export class AccountButtons {
}

export class AccountTokens {
}

export class AccountTransactions {
}