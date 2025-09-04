// src/components/StakingComponent.ts
import useStakingDemo from '@/hooks/solana/useStakingDemo'  // Ajuste ce chemin selon ta structure
import {PublicKey} from '@solana/web3.js'

interface StakingComponentProps {
    accountInfo?: any
}

export default function StakingComponent({accountInfo}: StakingComponentProps) {
    const pubKey = new PublicKey('TaPublicKeyIci...')  // Remplace par ta vraie clé publique
    useStakingDemo(pubKey)

    return <div>Check console for staking;
        info logs.</div>
}
