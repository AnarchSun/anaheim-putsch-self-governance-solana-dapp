// Définit les types des variables, erreurs, résultats de mutation

export type TransferVariables = {
  to: string;
  amount: number;
};

export type TransferError = {
  message: string;
  code?: number;
};

// Optionnel, type générique pour mutation, s’adapte si besoin
export interface MutationResult<TData = any, TError = Error, TVariables = any> {
  data?: TData;
  error?: TError;
  variables?: TVariables;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  reset: () => void;
}
