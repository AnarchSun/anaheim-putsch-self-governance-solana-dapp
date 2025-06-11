// src/components/BalanceComponent.tsx
import React from 'react';

type BalanceComponentProps = {
  userId?: string;
};

export const BalanceComponent: React.FC<BalanceComponentProps> = ({ userId }) => {
  return <div>Balance pour user : {userId ?? 'inconnu'}</div>;
};

export default BalanceComponent;
