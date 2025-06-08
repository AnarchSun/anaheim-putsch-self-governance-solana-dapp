'use client';

import React from 'react';
import { useWalletUi } from '../wallet/wallet-hooks';

export function WalletStatus() {
  const { wallet, client } = useWalletUi();

  if (!wallet.connected) {
    return <div>Wallet non connecté</div>;
  }

  return (
    <div>
      Wallet connecté : <strong>{wallet.publicKey?.toBase58()}</strong>
  <br />
  Endpoint RPC : {client.rpcEndpoint}
  </div>
);
}
