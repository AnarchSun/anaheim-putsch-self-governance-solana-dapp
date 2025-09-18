// File: src/app/stake-mining/stake/StakeViewerScratch.tsx

'use client'

import React from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Meta, Stake } from '@solana-program/stake'
import { SOLANA_CLUSTER_URL } from '@/config/solana'

interface StakeAccount {
    activationEpoch: number
    delegatedStake: number
    discriminant: number
    meta: Meta
    stake: Stake
}

export function useStakeAccount(pubkey: PublicKey | undefined) {
    const [stakeAccount, setStakeAccount] = React.useState<StakeAccount | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const connection = new Connection(SOLANA_CLUSTER_URL)
        let mounted = true

        async function fetchStakeAccount() {
            if (!pubkey) {
                if (mounted) {
                    setStakeAccount(null)
                    setError('Clé publique manquante ou invalide.')
                }
                return
            }
            try {
                const accountInfo = await connection.getParsedAccountInfo(pubkey)
                if (!accountInfo.value) {
                    if (mounted) {
                        setStakeAccount(null)
                        setError('Aucune information de compte trouvée.')
                    }
                    return
                }

                const data = accountInfo.value.data
                if (typeof data !== 'object' || !('parsed' in data)) {
                    if (mounted) setError('Format de compte inattendu')
                    return
                }

                const parsed = (data as any).parsed
                const info = parsed?.info
                if (!info || !info.stake) {
                    if (mounted) setError('Aucune info stake')
                    return
                }

                if (mounted) {
                    setStakeAccount({
                        activationEpoch: info.stake.activationEpoch,
                        delegatedStake: info.stake.delegatedStake,
                        discriminant: 0,
                        meta: info.meta,
                        stake: info.stake,
                    })
                    setError(null)
                }
            } catch (err) {
                console.error('Erreur lors de la récupération du compte de stake:', err)
                if (mounted) setError('Erreur lors de la récupération du compte de stake')
            }
        }
        fetchStakeAccount().then(() =>{} )

        return () => { mounted = false }
    }, [pubkey])

    return { stakeAccount, error }
}
