// test/testBase58.ts
import bs58 from 'bs58'

export function isValidBase58(str: string): boolean {
  try {
    bs58.decode(str)
    return true
  } catch {
    return false
  }
}
