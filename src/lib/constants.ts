// src/lib/constants.tsx

export const CLUSTER = 'devnet' as const // Change to 'mainnet-beta' or 'localnet' as needed

export const DEFAULT_ADDRESS = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

// Programs deployed via Anchor (anchor.toml [programs.devnet])
export const PROGRAM_IDS = {
  anaheim: '78aAD6rT9QNwjXEUwrrTwRdtE35khVh1opAQLjMsxvVb',
  journal: 'F4ao4JM1dfxnKNAUJtJP6mPyrHD7QeYEBZwLU5ANVThd',
} as const

export const CLUSTERS = ['devnet', 'mainnet-beta', 'testnet', 'localnet'] as const

export type Cluster = (typeof CLUSTERS)[number]
