// src/utils/getStakeActivationManual.ts

import { Connection, PublicKey } from '@solana/web3.js'

type StakeAccountInfo = {
  delegation: {
    stake: number
    activationEpoch?: number
    deactivationEpoch?: number
    voter?: string
  }
}

type ParsedStakeAccountData = {
  info: {
    stake: StakeAccountInfo
    state: string
  }
  type: string
}

type StakeActivationManualResult = {
  state: string
  active: number
  inactive: number
}

export async function getStakeActivationManual(
  connection: Connection,
  pubkey: PublicKey,
): Promise<StakeActivationManualResult> {
  const accountInfo = await connection.getParsedAccountInfo(pubkey)
  const parsedData = accountInfo.value?.data

  if (!parsedData || typeof parsedData !== 'object' || !('parsed' in parsedData)) {
    throw new Error('Invalid or empty stake account')
  }

  const parsed = parsedData as { parsed: ParsedStakeAccountData }

  const stake = parsed.parsed.info.stake
  const state = parsed.parsed.info.state

  return {
    state,
    active: stake.delegation.stake,
    inactive: 0, // 🔸 estimation impossible sans `getEpochInfo`
  }
}

export async function fetchStakeActivationSafe(connection: Connection, pubkey: PublicKey) {
  // On oublie la méthode dépréciée et on va direct au fallback manuel
  return await getStakeActivationManual(connection, pubkey)
}
