// src/app/account/create-transaction.tsx
'use client'

import { useConnection } from '@/hooks/solana/useConnection'
import { CreateTransaction } from '@/components/account/createTransaction'

export default function CreateTransactionPage() {
  const { connection } = useConnection() // ✅ Objet, pas fonction

  const recipient = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

  return (
    <CreateTransaction
      connection={connection}
      recipientAddress={recipient}
    />
  )
}
