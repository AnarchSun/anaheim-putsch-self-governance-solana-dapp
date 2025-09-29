// FILE: src/components/wallet/ui/wallet-dropdown.tsx
'use client'

import * as React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WalletIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ellipsify, UiWallet, useWalletUi, useWalletUiWallet } from '@wallet-ui/react'

function WalletAvatar({ className, wallet }: { className?: string; wallet: UiWallet }) {
    return (
        <Avatar className={cn('rounded-md h-6 w-6', className)}>
            <AvatarImage src={wallet.icon} alt={wallet.name} />
            <AvatarFallback>{wallet.name[0]}</AvatarFallback>
        </Avatar>
    )
}

function WalletDropdownItem({ wallet }: { wallet: UiWallet }) {
    const { connect } = useWalletUiWallet({ wallet })
    return (
        <DropdownMenuItem
            className="cursor-pointer"
            key={wallet.name}
            onClick={() => connect()}
        >
            {wallet.icon ? <WalletAvatar wallet={wallet} /> : null}
            {wallet.name}
        </DropdownMenuItem>
    )
}

interface WalletDropdownProps {
    wallets?: UiWallet[]
}

export function WalletDropdown({ wallets = [] }: WalletDropdownProps) {
    const walletUi = useWalletUi()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={walletUi.connected ? 'outline' : 'ghost'}
                    className="cursor-pointer flex items-center gap-2"
                >
                    {walletUi.wallet?.icon ? (
                        <WalletAvatar wallet={walletUi.wallet} />
                    ) : (
                        <WalletIcon className="h-5 w-5" />
                    )}
                    {walletUi.connected
                        ? walletUi.account
                            ? ellipsify(walletUi.account.address)
                            : walletUi.wallet?.name
                        : 'Select Wallet'}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {walletUi.account && (
                    <>
                        <DropdownMenuItem className="cursor-pointer" onClick={walletUi.copy}>
                            Copy address
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={walletUi.disconnect}>
                            Disconnect
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                {wallets.length > 0 ? (
                    wallets.map((w) => <WalletDropdownItem key={w.name} wallet={w} />)
                ) : (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                        <a
                            href="https://solana.com/solana-wallets"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get a Solana wallet to connect.
                        </a>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
