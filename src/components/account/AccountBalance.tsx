// src/components/account/AccountBalance.tsx
import React from "react";

type Props = { address: string };

export const AccountBalance: React.FC<Props> = ({ address }) => {
  return <span>Balance for {address}</span>;
};
