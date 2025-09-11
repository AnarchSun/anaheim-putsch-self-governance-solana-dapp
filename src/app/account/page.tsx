// PATH: src/app/account/page.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fixes for:
// - React Hook "useTransferSolMutation" is called conditionally. (react-hooks/rules-of-hooks)
// - _address/_client unused variable warnings (@typescript-eslint/no-unused-vars)
// - Always pass endpoint explicit. Batch fix eternal. Filename always at the top.

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
import { useTransferSolMutation } from '@/hooks/solana/useTransferSolMutation'
import { useWalletUi } from '@/hooks/wallet/useWalletUi'
import { Address } from 'gill'


const DEFAULT_ENDPOINT = 'https://api.devnet.solana.com' // PATCH: Use devnet endpoint for testing!

export default function AccountDashboardPage() {
    const { wallet, address } = useWalletUi()
    // PATCH: Hooks must always be called unconditionally and in the same order
    const transferSolMutation = useTransferSolMutation({
        address: address as Address,
        endpoint: DEFAULT_ENDPOINT,
    })

    // PATCH: Destructure mutation outside conditional
    const {
        data,
        isSuccess,
        isError,
        error,
    } = transferSolMutation

    useEffect(() => {
        if (isSuccess && data) {
            toast.success(`✅ Transaction réussie ! Signature: ${data}`)
        }
        if (isError) {
            toast.error(`❌ Échec de transaction : ${error?.message || 'Erreur inconnue'}`)
        }
    }, [isSuccess, isError, data, error])

    // PATCH: Render fallback if wallet not connected
    if (!wallet || !wallet.publicKey || !address) {
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
                <StakeStatus address={base58Address} client={undefined}
                    // PATCH: Remove unused parameter warnings by removing unused args
                             initializeStakeAccount={function () {
                                 throw new Error("Function not implemented.")
                             }} />
                <WalletInfo />
                <AccountBalance address={base58Address} />
                <AccountListFeature />
                <Rapper address="83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB" />
            </section>
        </main>
    )
}

// PATCH NOTES:
// - Unconditional hook call: useTransferSolMutation always called (never inside condition)
// - Destructuring mutation result always, no conditional destructuring
// - Remove unused parameters from initializeStakeAccount to fix @typescript-eslint/no-unused-vars
// - Devnet endpoint for test/dev environment
// - Filename/path toujours!