// FILE: src/app/account/page.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

// --- Local Component Imports ---
// These components are features you want on your dashboard.
import AccountListFeature from '@/components/account/account-list-feature';
import { CreateTransaction } from '@/components/account/createTransaction';
import { StakeStatus } from '@/components/stake/StakeStatus';
import { Rapper } from '@/components/rapper';
import WalletInfo from "@/components/wallet/WalletInfo";

// --- UI & Data Components for the Dashboard ---
import AccountUI from '@/components/account/account-ui';
// We need these components to show details inside the AccountUI.
// Assuming they are exported from these files:

import { AccountButtons } from '@/components/account/AccountButtons';
import {AccountBalance} from "@/components/account/AccountBalance";


/**
 * This is the main page for the /account route.
 * It acts as a dashboard, showing information about the connected user's wallet
 * and providing access to various account-related features.
 */
export default function AccountDashboardPage() {
    const { publicKey } = useWallet();

    // If no wallet is connected, show a prompt to the user.
    if (!publicKey) {
        return (
            <div className="container py-10 text-center">
                <h2 className="text-2xl font-bold">Account Dashboard</h2>
                <p className="text-muted-foreground mt-2">
                    Please connect your wallet to continue.
                </p>
            </div>
        );
    }

    // Once the wallet is connected, we get the address to use throughout the page.
    const address = publicKey.toBase58();

    return (
        <main className="space-y-12 p-6">
            {/*
              SECTION 1: Main Wallet Info
              This uses the AccountUI component correctly with the right props.
              'pubkey' has been corrected to 'address', and the invalid 'account' prop is removed.
            */}
            <section>
                <h2 className="text-xl font-bold mb-4">Your Wallet Overview</h2>
                <AccountUI
                    address={address}
                    label="Primary Wallet"
                    balance={<AccountBalance address={address} />}
                    actions={<AccountButtons address={address} />}
                />
            </section>

            {/*
              SECTION 2: Other Account Features
              These are the other components you want to display on the dashboard.
            */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold">Tools & Features</h2>

                {/* This component can now use the dynamic, connected address */}
                <CreateTransaction recipientAddress={address} />

                {/* These components likely get their data from the wallet context directly */}
                <StakeStatus />
                <WalletInfo />
                <AccountListFeature />

                {/* This component with a hardcoded address seems to be for testing/display purposes */}
                <Rapper address="9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt" />
            </section>
        </main>
    )
}