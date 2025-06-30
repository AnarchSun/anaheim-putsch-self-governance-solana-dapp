// src/hooks/stake/stake-codecs.ts
// src/lib/solana/stake-codecs.ts

import {
  fixCodecSize,
  getArrayCodec,
  getBytesCodec,
  getStructCodec,
  getU32Codec,
  getU64Codec,
} from '@solana/codecs'
import type { ReadonlyUint8Array } from '@solana/codecs'

// -------------------- Codecs --------------------

const authorizedCodec = getStructCodec([
  ['staker', fixCodecSize(getBytesCodec(), 32)],
  ['withdrawer', fixCodecSize(getBytesCodec(), 32)],
])

const lockupCodec = getStructCodec([
  ['unixTimestamp', getU64Codec()],
  ['epoch', getU64Codec()],
  ['custodian', fixCodecSize(getBytesCodec(), 32)],
])

const metaCodec = getStructCodec([
  ['rentExemptReserve', getU64Codec()],
  ['authorized', authorizedCodec],
  ['lockup', lockupCodec],
])

const delegationCodec = getStructCodec([
  ['voterPubkey', fixCodecSize(getBytesCodec(), 32)],
  ['stake', getU64Codec()],
  ['activationEpoch', getU64Codec()],
  ['deactivationEpoch', getU64Codec()],
  ['unused', getU64Codec()],
])

const stakeCodec = getStructCodec([
  ['delegation', delegationCodec],
  ['creditsObserved', getU64Codec()],
])

export const stakeAccountCodec = getStructCodec([
  ['discriminant', getU32Codec()],
  ['meta', metaCodec],
  ['stake', stakeCodec],
])

const stakeHistoryEntryCodec = getStructCodec([
  ['epoch', getU64Codec()],
  ['effective', getU64Codec()],
  ['activating', getU64Codec()],
  ['deactivating', getU64Codec()],
])

export const stakeHistoryCodec = getArrayCodec(stakeHistoryEntryCodec, {
  size: getU64Codec(),
})

// -------------------- Types --------------------

export interface Meta {
  rentExemptReserve: bigint
  authorized: Authorized
  lockup: Lockup
}

export interface Stake {
  delegation: Delegation
  creditsObserved: bigint
}

export interface Authorized {
  staker: Uint8Array
  withdrawer: Uint8Array
}

export interface Lockup {
  unixTimestamp: bigint
  epoch: bigint
  custodian: Uint8Array
}

export interface Delegation {
  voterPubkey: ReadonlyUint8Array
  stake: bigint
  activationEpoch: bigint
  deactivationEpoch: bigint
  unused: bigint
}

export interface StakeHistoryEntry {
  epoch: bigint
  effective: bigint
  activating: bigint
  deactivating: bigint
}
