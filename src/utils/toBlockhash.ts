// FILE: src/utils/toBlockhash.ts

import { Blockhash as Web3Blockhash } from '@solana/web3.js'
import { Blockhash } from 'gill'

export function toBlockhash(blockhash: Web3Blockhash): Blockhash {
    // En pratique, 'Blockhash' dans gill est juste un alias de string
    return blockhash as Blockhash
}
