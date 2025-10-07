// PATH: scripts/check_token_balance.js

import { Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";
import BN from "bn.js"; // npm install bn.js

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
const tokenAccountPubkey = new PublicKey("CzeoLGJf2emwiKg8CoGbyy9gpc2kHF3SXtQbGg14ENyA");

(async () => {
    const accountInfo = await connection.getAccountInfo(tokenAccountPubkey);
    if (!accountInfo) {
        console.log("Token account not found!");
        return;
    }

    const data = Buffer.from(accountInfo.data);
    const tokenAccount = AccountLayout.decode(data);

    // Decode the raw amount bytes to a number using BN
    const amount = new BN(tokenAccount.amount, 10, "le"); // little-endian
    console.log("Token balance:", amount.toString());
})();
