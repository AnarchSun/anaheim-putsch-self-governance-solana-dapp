// src/components/account/AccountButtons.tsx
import React from 'react'

type Props = { address: string }

export const AccountButtons: React.FC<Props> = ({ address }) => {
  return <div>Buttons for {address}</div>
}
