// PATH: src/components/explorer-link.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix unused variables 'transaction', 'address'; matrix override!

import React from 'react'

interface ExplorerLinkProps {
    label: string,
    path: string,
    transaction?: string,
    address?: string
}

/**
 * ExplorerLink
 * PATCH: Use transaction and address to anchor explorer link if provided.
 * - If transaction is provided, link to tx details.
 * - If address is provided (and path doesn't start with 'address/'), link to address details.
 * - Otherwise link to the raw path.
 */
export function ExplorerLink({label, path, transaction, address}: ExplorerLinkProps) {
    const baseUrl = 'https://explorer.solana.com'
    let url = `${baseUrl}/${path}`

    // PATCH: Use transaction if provided
    if (transaction) {
        url = `${baseUrl}/tx/${transaction}`
    } else if (address && !path.startsWith('address/')) {
        url = `${baseUrl}/address/${address}`
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
        >
            {label}
        </a>
    )
}

// PATCH NOTES:
// - 'transaction' and 'address' used to generate correct explorer links
// - No more unused variable warning
// - Matrix override, filename/path toujours!