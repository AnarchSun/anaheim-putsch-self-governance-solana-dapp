// FILE: src/components/account/account-ui.tsx
'use client';

import React, { ReactNode } from 'react';
import { AppHero } from '@/components/app-hero'; // Assuming you have a hero component for titles
import { ExplorerLink } from '@/components/explorer-link'; // Assuming you have a component to link to the explorer

// Define the props that the AccountUI component will accept.
interface AccountUiProps {
    address: string;
    label?: string;
    balance?: ReactNode; // Allows passing a component like <AccountBalance />
    actions?: ReactNode; // Allows passing a component with buttons like <AccountButtons />
    children?: ReactNode; // For any other content, like transaction lists
}

/**
 * A reusable UI container component for displaying information about a Solana account.
 * It provides a consistent layout for the address, balance, and action buttons.
 *
 * @param {string} address - The public key of the account to display.
 * @param {string} [label] - An optional label for the account card (e.g., "Your Wallet").
 * @param {ReactNode} [balance] - A component to display the account's balance.
 * @param {ReactNode} [actions] - A component containing action buttons (e.g., Send, Receive).
 * @param {ReactNode} [children] - Any additional components or content to render inside the card.
 */
export default function AccountUI({ address, label, balance, actions, children }: AccountUiProps) {
    return (
        <div className="space-y-6">
            {/* Display the title and the account address */}
            <AppHero
                title={label || 'Account'}
                subtitle={
                    <div className="flex items-center justify-center">
                        <ExplorerLink path={`account/${address}`} label={address} />
                    </div>
                }
            />

            {/* Display the account balance if provided */}
            {balance}

            {/* Display the action buttons if provided */}
            {actions}

            {/* Render any additional children components */}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}