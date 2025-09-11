import { Connection, PublicKey } from '@solana/web3.js'

export async function fetchStakeActivation(pubkeyStr: string) {
    const connection = new Connection('https://api.devnet.solana.com')
    const pubkey = new PublicKey(pubkeyStr)
    try {
        // Pour l’état d’activation, tu veux getStakeActivation, pas juste getAccountInfo!
        const activation = await connection.getStakeActivation(pubkey)
        console.log('Activation:', activation)
        return activation
    } catch (e) {
        console.error('Erreur:', e)
        return null
    }
}