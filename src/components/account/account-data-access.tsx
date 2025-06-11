'use client'

import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// 🔧 Cluster helper
function useClusterEndpoint() {
  const wallet = useAnchorWallet()
  const endpoint = wallet?.connection?.rpcEndpoint ?? clusterApiUrl('devnet')
  return endpoint.includes('testnet')
    ? clusterApiUrl('testnet')
    : endpoint.includes('mainnet')
      ? clusterApiUrl('mainnet-beta')
      : clusterApiUrl('devnet')
}

// 🔧 Connection instance
function useConnection() {
  const endpoint = useClusterEndpoint()
  return new Connection(endpoint, 'confirmed')
}

// 🔧 Address wrapper
export type Address = string

// 🔧 Get balance
export function useGetBalance({ address }: { address: Address }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-balance', address],
    queryFn: async () => {
      const pubkey = new PublicKey(address)
      return await connection.getBalance ( pubkey )
    },
  })
}

// 🔧 Get recent signatures
export function useGetSignatures({ address }: { address: Address }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-signatures', address],
    queryFn: async () => {
      const pubkey = new PublicKey(address)
      return await connection.getSignaturesForAddress(pubkey)
    },
  })
}

// 🔧 Get token accounts
export function useGetTokenAccounts({ address }: { address: Address }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-token-accounts', address],
    queryFn: async () => {
      const pubkey = new PublicKey(address)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program
      })
      return tokenAccounts.value
    },
  })
}

// 🔧 Request airdrop
export function useRequestAirdrop({ address }: { address: Address }) {
  const connection = useConnection()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['airdrop', address],
    mutationFn: async (amount: number = 1) => {
      const pubkey = new PublicKey(address)
      return await connection.requestAirdrop ( pubkey, amount * LAMPORTS_PER_SOL )
    },
    onSuccess: (signature) => {
      toast.success(`Airdrop success: ${signature}`)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['get-balance', address] }),
        queryClient.invalidateQueries({ queryKey: ['get-signatures', address] }),
      ])
    },
    onError: (err) => {
      toast.error(`Airdrop failed: ${err}`)
    },
  })
}

// 🔧 Transfer SOL
export function useTransferSol({
                                 fromAddress,
                               }: {
  fromAddress: Address
}) {
  const wallet = useAnchorWallet()
  const connection = useConnection()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transfer-sol', fromAddress],
    mutationFn: async ({ to, amount }: { to: Address; amount: number }) => {
      if (!wallet?.publicKey || !wallet.signTransaction) throw new Error('Wallet not connected')
      const toPubkey = new PublicKey(to)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      )

      const signed = await wallet.signTransaction(transaction)
      return await connection.sendRawTransaction ( signed.serialize () )
    },
    onSuccess: (signature) => {
      toast.success(`Transfer successful: ${signature}`)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['get-balance', fromAddress] }),
        queryClient.invalidateQueries({ queryKey: ['get-signatures', fromAddress] }),
      ])
    },
    onError: (err) => {
      toast.error(`Transfer failed: ${err}`)
    },
  })
}
