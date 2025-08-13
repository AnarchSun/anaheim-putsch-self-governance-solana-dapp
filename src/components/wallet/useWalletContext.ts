// File: src/components/wallet/ueseWalletContext.ts

import { useContext } from "react";
import {WalletContext} from "@solana/wallet-adapter-react";


export function useWalltContext() {
    const context = useContext(WalletContext);

    if (!context) {
        throw new Error("useWalletContext must be used within a WalletContextProvider");
    }

    return context;
}
