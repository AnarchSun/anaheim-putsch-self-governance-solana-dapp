import type { Program } from '@coral-xyz/anchor'
import type { Anaheim } from './anchor/target/types/anaheim'

declare global {
  var anchor: typeof import('@coral-xyz/anchor')
  var program: Program<Anaheim>
}

export {}
