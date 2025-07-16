// src/components/wallet/ui/wallet-dropdown.tsx

'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { WalletIcon } from 'lucide-react'

export function WalletDropdown() {
    const { publicKey } = useWallet()

    if (!publicKey) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <WalletIcon className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-mono">
                    {publicKey.toBase58().slice(0, 4)}...
                    {publicKey.toBase58().slice(-4)}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}