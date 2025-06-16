import * as anchor from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import idl from '../target/idl/anaheim.json'

const provider = anchor.AnchorProvider.env()
new PublicKey('CT7k1DEdM7tVvk4zw7MN3S1ZtefMAo6mQq85gsiC4oL3')
const program = new anchor.Program(idl as anchor.Idl, provider)

console.log(`Program loaded: ${program.programId.toBase58()}`)
