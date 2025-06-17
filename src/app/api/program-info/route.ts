// apps/frontend/src/app/api/program-info/route.ts
import { NextResponse } from 'next/server'
import { getAnaheimProgram } from '@/../packages/anchor-client/src/getAnaheimProgram'
import { AnchorProvider } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'

export async function GET() {
  const conn = new Connection('https://api.devnet.solana.com')
  const provider = new AnchorProvider(conn, null as any, {}) // ou ton wallet backend
  const program = getAnaheimProgram(provider)

  return NextResponse.json({ programId: program.programId.toBase58() })
}
