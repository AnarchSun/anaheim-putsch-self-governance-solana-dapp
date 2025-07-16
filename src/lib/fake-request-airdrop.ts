// File: src/lib/fakeRequestAirdrop.ts

import type { Address, Commitment, Lamports, PendingRpcRequest, Signature } from 'gill'

export const fakeRequestAirdrop = (
    _recipientAccount: Address,
    _lamports: Lamports,
    _config?: Readonly<{ commitment?: Commitment }>
): PendingRpcRequest<Signature> => {
    return {
        send: () => {
            throw new Error('requestAirdrop is not supported on mainnet')
        },
        simulate: () => {
            throw new Error('simulate is not available for requestAirdrop on mainnet.')
        },
    }
}
