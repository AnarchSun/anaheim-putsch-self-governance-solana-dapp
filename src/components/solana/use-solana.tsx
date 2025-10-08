// src/components/solana/use-solana.tsx
import { useWalletUi } from '@wallet-ui/react'
import { useMemo } from 'react'
import {SOLANA_RPC_ENDPOINT, PROGRAM_ID, WALLET_PUBKEY, SOLANA_CLUSTER_URL} from '@/config/solana';
import { createRpc, createSolanaRpcApi } from '@solana/rpc'   // ⚡ importer la factory runtime
import { createHttpTransport } from '@solana/rpc-transport-http'

function useSolana() {
    const walletUi = useWalletUi()

    const client = useMemo(
        () =>
            createRpc({
                api: createSolanaRpcApi(),                           // ✅ ici on passe une valeur runtime
                transport: createHttpTransport({ url: SOLANA_RPC_ENDPOINT }),
            }),
        []
    )
    return { ...walletUi,  WALLET_PUBKEY , client, cluster: SOLANA_CLUSTER_URL, PROGRAM_ID }

}

export default useSolana
