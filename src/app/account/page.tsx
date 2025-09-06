'use client'

import React, { useEffect } from 'react'
import { toast } from 'sonner'
import AccountListFeature from '@/components/account/account-list-feature'
import { StakeStatus } from '@/components/stake/StakeStatus'
import { Rapper } from '@/components/rapper'
import WalletInfo from '@/components/wallet/WalletInfo'
import AccountUI from '@/components/account/account-ui'
import { AccountButtons } from '@/components/account/AccountButtons'
import { AccountBalance } from '@/components/account/AccountBalance'
import { useTransferSolMutation } from '@/components/solana/useTransferSolMutation'
import { useWalletUi } from '@/hooks/wallet/useWalletUi'

// ⚑ NE JAMAIS EXPORTER DE PROVIDER ICI !
// ⚑ Si tu veux wrapper la page dans SolanaWalletProvider, fais-le dans src/app/account/layout.tsx

export default function AccountDashboardPage() {
    const { wallet } = useWalletUi()
    const { data, isSuccess, isError, error } = useTransferSolMutation({
        address: wallet?.publicKey?.toBase58()
    })

    useEffect(() => {
        if (isSuccess && data) {
            toast.success(`✅ Transaction réussie ! Signature: ${data}`)
        }
        if (isError) {
            toast.error(`❌ Échec de transaction : ${error?.message || 'Erreur inconnue'}`)
        }
    }, [isSuccess, isError, data, error])

    if (!wallet || !wallet.publicKey) {
        return (
            <div className="container py-10 text-center">
                <h2 className="text-2xl font-bold">Account Dashboard</h2>
                <p className="text-muted-foreground mt-2">Please connect your wallet to continue.</p>
            </div>
        )
    }

    const base58Address = wallet.publicKey.toBase58()

    return (
        <main className="space-y-12 p-6">
            <section>
                <h2 className="text-xl font-bold mb-4">Your Wallet Overview</h2>
                <AccountUI
                    address={base58Address}
                    label="Primary Wallet"
                    balance={<AccountBalance address={base58Address} />}
                    actions={<AccountButtons address={base58Address} />}
                />
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold">Tools & Features</h2>
                <StakeStatus />
                <WalletInfo />
                <AccountListFeature />
                <Rapper address="9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt" />
            </section>
        </main>
    )
}