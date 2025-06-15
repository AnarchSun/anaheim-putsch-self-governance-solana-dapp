// src/types/solana.ts

export interface StakeActivationResult {
  state: 'inactive' | 'activating' | 'active' | 'deactivating'
  active: number
  inactive: number
}
