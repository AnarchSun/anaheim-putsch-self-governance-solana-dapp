// src/components/wallet/wallet-button.tsx
'use client'

import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Transaction, SystemProgram } from '@solana/web3.js'

export function WalletButton() {
    const { connection } = useConnection()
    const {
        publicKey,
        connected,
        connect,
        disconnect,
        sendTransaction,
        wallet,
    } = useWallet()

    const handleTx = async () => {
        if (!wallet || !connected || !publicKey) {
            console.warn('⚠️ Wallet non sélectionné ou non connecté')
            return
        }

        const tx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: publicKey,
                lamports: 0,
            })
        )

        try {
            const sig = await sendTransaction(tx, connection)
            console.log('✅ TX envoyée:', sig)
        } catch (e) {
            console.error('💥 Erreur TX:', e)
        }
    }

    return connected ? (
        <div className="flex gap-2">
            <Button onClick={handleTx}>Envoyer TX</Button>
            <Button variant="outline" onClick={disconnect}>Déconnecter</Button>
        </div>
    ) : (
        <Button onClick={connect}>Connecter Wallet</Button>
    )
}
