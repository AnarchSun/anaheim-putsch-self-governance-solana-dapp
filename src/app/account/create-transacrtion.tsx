import { CreateTransaction } from '@/components/account/createTransaction'
import { connection } from 'next/server'

export default function AccountPage() {
  const recipient = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

  return <CreateTransaction connection={connection} recipientAddress={recipient} />
}
