import React from 'react'

type Props = {
  address: string
}

export const AccountBalance: React.FC<Props> = ({ address }) => {
  return (
    <div>
      Solana Balance for: {address}
      {/* Tu peux ajouter un hook ici pour fetcher le solde */}
    </div>
  )
}
