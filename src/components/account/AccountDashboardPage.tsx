'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect } from 'react';

import AccountListFeature from '@/components/account/account-list-feature';
import { CreateTransaction } from '@/components/account/createTransaction';
import { StakeStatus } from '@/components/stake/StakeStatus';
import { Rapper } from '@/components/rapper';
import WalletInfo from '@/components/wallet/WalletInfo';
import AccountUI from '@/components/account/account-ui';
import { AccountButtons } from '@/components/account/AccountButtons';
import { AccountBalance } from '@/components/account/AccountBalance';

import { useTransferSolMutation } from '@/hooks/solana/useSolanaHooks';
import { asAddress } from '@solana/addresses'; // ✅ UTILISER CELUI-CI POUR TYPER

export default function AccountDashboardPage() {
    const { publicKey, signTransaction, sendTransaction } = useWallet();

    if (!publicKey) {
        return (
            <div className="container py-10 text-center">
                <h2 className="text-2xl font-bold">Account Dashboard</h2>
                <p className="text-muted-foreground mt-2">Please connect your wallet to continue.</p>
            </div>
        );
    }

    const address = asAddress(publicKey.toBase58()); // ✅ TYPE-SAFE Address

    const { mutateAsync: transferSol } = useTransferSolMutation({ address });

    useEffect(() => {
        // Ce bloc semble confus, on le remplace par une vraie gestion d’état
        // pour afficher la transaction une fois réussie.
    }, []);

    return (
        <main className="space-y-12 p-6">
            <section>
                <h2 className="text-xl font-bold mb-4">Your Wallet Overview</h2>
                <AccountUI
                    address={address}
                    label="Primary Wallet"
                    balance={<AccountBalance address={address} />}
                    actions={<AccountButtons address={address} />}
                />
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold">Tools & Features</h2>
                <CreateTransaction recipientAddress={address} /* transferSol removed unless supported */ />
                <StakeStatus />
                <WalletInfo />
                <AccountListFeature />
                <Rapper address="9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt" />
            </section>
        </main>
    );
}
