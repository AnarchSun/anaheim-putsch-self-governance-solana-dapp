// src/components/account/AccountTransactions.tsx
import React from 'react'

type Props = { address: string }

export const AccountTransactions: React.FC<Props> = ({ address }) => {
  return <div>Transactions for {address}</div>
}
