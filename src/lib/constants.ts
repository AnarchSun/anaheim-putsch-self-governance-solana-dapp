// src/lib/constants.ts

export const CLUSTER = 'devnet' as const // Change to 'mainnet-beta' or 'localnet' as needed

export const DEFAULT_ADDRESS = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

// Programs deployed via Anchor (anchor.toml [programs.devnet])
export const PROGRAM_IDS = {
  anaheim: '83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB',
} as const

export const CLUSTERS = ['devnet', 'mainnet-beta', 'testnet', 'localnet'] as const

export type Cluster = (typeof CLUSTERS)[number]