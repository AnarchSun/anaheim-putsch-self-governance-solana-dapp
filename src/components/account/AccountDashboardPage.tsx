// FILE: src/app/account/page.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

// --- Imports des composants ---
import AccountListFeature from '@/components/account/account-list-feature';
import { CreateTransaction } from '@/components/transactions/create-transaction';
import { StakeStatus } from '@/components/stake/StakeStatus';
import { Rapper } from '@/components/rapper';
import WalletInfo from '@/components/wallet/WalletInfo';
import AccountUI from '@/components/account/account-ui';
import { AccountButtons } from '@/components/account/AccountButtons';
import { AccountBalance } from '@/components/account/AccountBalance';

export default function AccountDashboardPage() {
    const { publicKey } = useWallet();

    if (!publicKey) {
        return (
            <div className="container py-10 text-center">
                <h2 className="text-2xl font-bold">Tableau de Bord</h2>
                <p className="text-muted-foreground mt-2">Veuillez connecter votre portefeuille pour continuer.</p>
            </div>
        );
    }

    // On utilise simplement la chaîne de caractères base58 pour l'affichage
    const address = publicKey.toBase58();

    return (
        <main className="space-y-12 p-6">
            <section>
                <h2 className="text-xl font-bold mb-4">Aperçu de votre portefeuille</h2>
                <AccountUI
                    address={address}
                    label="Portefeuille Principal"
                    balance={<AccountBalance address={address} />}
                    actions={<AccountButtons address={address} />}
                />
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold">Outils et Fonctionnalités</h2>
                {/* Le composant CreateTransaction gère maintenant sa propre logique */}
                <CreateTransaction />
                <StakeStatus />
                <WalletInfo />
                <AccountListFeature />
                <Rapper address="9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt" />
            </section>
        </main>
    );
}