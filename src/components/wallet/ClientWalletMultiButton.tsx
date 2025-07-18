// FILE: src/components/wallet/ClientWalletMultiButton.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

/**
 * This is the magic. We use next/dynamic to import the WalletMultiButton
 * and explicitly tell Next.js to disable Server-Side Rendering (ssr: false).
 * This means the component will only be rendered in the browser,
 * preventing any hydration mismatches.
 */
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// We export a new component that simply renders the dynamic one.
export default function ClientWalletMultiButton() {
    return <WalletMultiButtonDynamic />;
}