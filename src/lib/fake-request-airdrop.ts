// FILE: src/lib/fake-request-airdrop.ts

import type { Address, Commitment, Lamports, PendingRpcRequest, Signature } from 'gill';

export const fakeRequestAirdrop = (
    _recipientAccount: Address,
    _lamports: Lamports,
    _config?: Readonly<{ commitment?: Commitment }>
): PendingRpcRequest<Signature> => {
    // ===================================================================
    // THIS IS THE DEFINITIVE FIX.
    // The `simulate` property has been removed from this object.
    // The `PendingRpcRequest` type only defines a `send` method, so
    // including `simulate` was a type error. This resolves the crash.
    // ===================================================================
    return {
        send: () => {
            throw new Error('requestAirdrop is not supported on mainnet');
        },
    };
};