import { CreateTransaction } from '@/components/account/createTransaction'

export default function AccountPage({ connection }) {
  const recipient = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

  return <CreateTransaction connection={connection} recipientAddress={recipient} />
}
