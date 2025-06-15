// Types nominales maison pour le typage fort

export type Address = string & { __brand?: 'Address' }
export interface IAccountMeta {
  address: Address
  isSigner: boolean
  isWritable: boolean
  // ajoute 'role' si besoin, mais garde en optionnel pour compatibilité
  role?: string
}

export interface IInstruction<Accounts extends IAccountMeta[] = IAccountMeta[]> {
  programAddress: string
  data: Buffer
  accounts: Accounts
}

// Fonction toAddress basique, juste pour marquer le type
export function toAddress(addr: string): Address {
  return addr as Address
}
