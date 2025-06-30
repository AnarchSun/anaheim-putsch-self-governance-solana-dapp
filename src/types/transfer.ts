// src/types/transfer.ts
/* eslint-disable @typescript-eslint/no-unused-vars */

export type TransferVariables = {
  to: string
  amount: number
}

export type TransferError = {
  message: string
  code?: number
}

export interface MutationResult<TData = any, TError = Error, TVariables = any> {
  data?: TData
  error?: TError
  variables?: TVariables
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  reset: () => void
}
