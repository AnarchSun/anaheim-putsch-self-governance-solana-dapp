// PATH: src/app/account/page.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: Import endpoint & programId from config/solana, never hardcode, always batch fix, filename/path éternel!

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
// PATCH: Import endpoint & programId from config/solana (source of truth!)
import { SOLANA_CLUSTER_URL as ENDPOINT, PROGRAM_ID } from '@/config/solana'

export default function AccountDashboardPage() {
    const { wallet, address } = useWalletUi()
    const transferSolMutation = useTransferSolMutation({
        address: address as Address,
        endpoint: ENDPOINT, // PATCH: Use imported endpoint!
    })

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
                <StakeStatus
                    address={base58Address}
                    client={undefined}
                    initializeStakeAccount={() => { throw new Error("Function not implemented.") }}
                />
                <WalletInfo />
                <AccountBalance address={base58Address} />
                <AccountListFeature />
                {/* PATCH: Rapper uses imported PROGRAM_ID, not hardcoded */}
                <Rapper address={PROGRAM_ID} />
            </section>
        </main>
    )
}

// PATCH NOTES:
// - ENDPOINT and PROGRAM_ID now imported from config/solana (source file!)
// - No hardcoded devnet endpoint or program address hanging around
// - Always batch fix, always filename/path éternel!