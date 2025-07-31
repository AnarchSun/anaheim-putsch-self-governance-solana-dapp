// FILE: src/hooks/solana/makeTransactionSigner.ts
import type { Address } from 'gill';

interface MyTransactionSigner {
    address: Address;
    signTransactionMessage: (txMessage: unknown) => Promise<Uint8Array>;
}

export function makeTransactionSigner(account: any): MyTransactionSigner {
    if (!account.address || !account.signTransactionMessage) {
        throw new Error('Wallet account does not implement required signer interface');
    }

    return {
        address: account.address as Address,
        signTransactionMessage: async (txMessage: unknown) => {
            return await account.signTransactionMessage({txMessage : txMessage});
        },
    };
}
