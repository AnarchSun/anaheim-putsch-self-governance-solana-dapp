// src/components/StakingComponent.ts
import useStakingDemo from '@/hooks/solana/useStakingDemo'  // Ajuste ce chemin selon ta structure
import { PublicKey } from '@solana/web3.js'

export default function StakingComponent() {
  const pubKey = new PublicKey('TaPublicKeyIci...')  // Remplace par ta vraie clé publique
  useStakingDemo(pubKey)

  return <div>Check console for staking;
  info logs.</div>
}
