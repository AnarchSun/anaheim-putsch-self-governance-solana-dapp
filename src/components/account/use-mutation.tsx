'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AppModal } from '../app-modal'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { PublicKey } from '@solana/web3.js'

type Address = string

interface TransferPayload {
  to: Address
  amount: number
}

async function transferSol({ to, amount }: TransferPayload): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return `Transfer of ${amount} SOL to ${to} succeeded`
}

function useTransferSol() {
  return useMutation<string, Error, TransferPayload>({
    mutationFn: transferSol,
  })
}

interface AccountUIProps {
  address?: Address
  account?: PublicKey
}

export function UseMutation(props: AccountUIProps) {
  const mutation = useTransferSol()

  const [destination, setDestination] = useState<string>('')
  const [amount, setAmount] = useState<string>('1')

  const isValidAddress = (addr: string) => {
    try {
      new PublicKey(addr)
      return true
    } catch {
      return false
    }
  }

  const isPending = mutation.status === 'pending'

  const isSubmitDisabled =
    isPending ||
    !destination ||
    !isValidAddress(destination) ||
    Number.isNaN(Number(amount)) ||
    Number(amount) <= 0

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

      {mutation.isError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Error: {mutation.error?.message}
        </div>
      )}

      {mutation.isSuccess && (
        <div style={{ color: 'green', marginTop: 8 }}>
          Success: {mutation.data}
        </div>
      )}
    </AppModal>
  )
}

// Placeholder classes à compléter plus tard
export class AccountChecker {}

export class AccountBalance {
  private _param: { address: string }
  constructor(param: { address: string }) {
    this._param = param
    // TODO: Implémenter récupération du solde
  }
}
