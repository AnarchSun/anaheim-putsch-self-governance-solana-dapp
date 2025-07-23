// FILE: src/utils/solana.ts
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider, Provider } from "@coral-xyz/anchor";// <- à adapter à ton app si le wallet vient d'un hook ou contexte

const getProvider = (): Provider => {

    const wallet = getWallet(); // Cette fonction doit retourner un wallet implémentant SignerWalletAdapter
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    return new AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
    });
};

export { getProvider };
