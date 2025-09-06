// FIX: Pure ESM, only use export default, never CommonJS (no module.exports or exports.*)
// signTransaction must be initialized to avoid runtime/TypeScript errors

import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';

// Default to undefined, but always provide a value (function or undefined)
export const useSignTransaction = () => {
    const { signTransaction } = useWallet();

    // signTransaction may be undefined if wallet is not connected
    // Always return a function (if available) or undefined
    const safeSignTransaction: (<T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>) | undefined = signTransaction
        ? async <T extends Transaction | VersionedTransaction>(transaction: T) => {
            return await signTransaction(transaction);
        }
        : undefined;

    return safeSignTransaction;
};

export default useSignTransaction;

export class singTransaction {
}