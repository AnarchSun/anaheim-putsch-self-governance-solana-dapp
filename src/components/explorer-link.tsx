import React from 'react'

interface ExplorerLinkProps {
    label: string,
    path: string,
    transaction?: string,
    address?: string
}

export function ExplorerLink({label, path, transaction, address}: ExplorerLinkProps) {
    const baseUrl = 'https://explorer.solana.com'
    return (
        <a
            href={`${baseUrl}/${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
        >
            {label}
        </a>
    )
}