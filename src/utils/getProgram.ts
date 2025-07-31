// FILE: src/utils/getProgram.ts

import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Idl } from "@coral-xyz/anchor";
import { Anaheim } from "@/idl/anaheim"; // your IDL type
import idl from "@/idl/anaheim.json"; // your IDL JSON

// You may want to make this dynamic
const PROGRAM_ID = new PublicKey("8bCmQr6a5Fr3S3CRbXyzBKXBNnRaTLDeArfYSWevJdfA");

export function getProgram(provider: AnchorProvider): Program<Anaheim> {
    return new Program(idl as Idl, PROGRAM_ID, provider);
}
