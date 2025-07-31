// FILE: src/components/wallet/ClientWalletMultiButton.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// This is the crucial part. We are dynamically importing the WalletMultiButton
// from the UI library, and explicitly telling Next.js to NOT render it on the server (ssr: false).
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Now, we create our component. It uses a NAMED export.
// Its only job is to render the dynamically imported button.
export function ClientWalletMultiButton() {
    return <WalletMultiButtonDynamic />;
}