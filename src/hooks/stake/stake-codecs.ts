// src/hooks/stake/stake-codecs.ts
import {
  fixCodecSize,
  getArrayCodec,
  getBytesCodec,
  getStructCodec,
  getU32Codec,
  getU64Codec,
} from '@solana/codecs';

export type StakeActivationState =
  | 'active'
  | 'inactive'
  | 'activating'
  | 'deactivating'
  | 'uninitialized'
  | null;

export const authorizedCodec = getStructCodec([
  ['staker', fixCodecSize(getBytesCodec(), 32)],
  ['withdrawer', fixCodecSize(getBytesCodec(), 32)],
]);

export const lockupCodec = getStructCodec([
  ['unixTimestamp', getU64Codec()],
  ['epoch', getU64Codec()],
  ['custodian', fixCodecSize(getBytesCodec(), 32)],
]);

export const metaCodec = getStructCodec([
  ['rentExemptReserve', getU64Codec()],
  ['authorized', authorizedCodec],
  ['lockup', lockupCodec],
]);

export const delegationCodec = getStructCodec([
  ['voterPubkey', fixCodecSize(getBytesCodec(), 32)],
  ['stake', getU64Codec()],
  ['activationEpoch', getU64Codec()],
  ['deactivationEpoch', getU64Codec()],
  ['unused', getU64Codec()],
]);

export const stakeCodec = getStructCodec([
  ['delegation', delegationCodec],
  ['creditsObserved', getU64Codec()],
]);

export const stakeAccountCodec = getStructCodec([
  ['discriminant', getU32Codec()],
  ['meta', metaCodec],
  ['stake', stakeCodec],
]);
