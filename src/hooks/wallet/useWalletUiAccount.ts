// FILE: src/hooks/wallet/useWalletUiAccount.ts
import {UiWalletAccount, useWalletUi} from "@wallet-ui/react"; // ou ton chemin custom
 // adapte si t'as un type custom

/**
 * Hook pour récupérer le compte wallet connecté via Wallet UI.
 * Lève une erreur si aucun wallet n’est connect.
 */
export function useWalletUiAccount(): UiWalletAccount {
    const { account } = useWalletUi();

    if (!account) {
        throw new Error("❌ No wallet connected. Please connect your wallet.");
    }

    return account;
}
