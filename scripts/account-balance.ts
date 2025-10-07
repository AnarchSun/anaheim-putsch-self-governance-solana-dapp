import { createSolanaRpc, Address } from "@solana/kit";

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

const addresss = " CzeoLGJf2emwiKg8CoGbyy9gpc2kHF3SXtQbGg14ENyA" as Address;
const { value } = await rpc.getBalance(addresss).send();

console.log(`Balance: ${Number(value) / 1_000_000_000} SOL`);