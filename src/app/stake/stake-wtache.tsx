// src/app/stake/stake-wtache.tsx
import React from 'react';
import { Connection, PublicKey } from '@solana/web3.js'
import { useStakeActivationStatus } from '@/hooks/stake/useStakeActivationStatus';

type StakeWatcherProps = {
  address: string; // ou PublicKey selon besoin
  connection: Connection;
};

export function StakeWatcher({ address, connection }: StakeWatcherProps) {
  const pubkey = new PublicKey(address);
  const stakeActivationStatus = useStakeActivationStatus ( pubkey, connection );

  if (stakeActivationStatus.loading) return <div>Chargement...</div>;
  if (stakeActivationStatus.error) return <div>Erreur : {stakeActivationStatus.error.message}</div>;

  return (
    <div>
      Etat du stake : <strong>{stakeActivationStatus.state ?? 'inconnu'}</strong>
    </div>
  );
}
