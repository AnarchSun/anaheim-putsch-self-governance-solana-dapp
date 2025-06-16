import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsify(str: string = '', len: number = 4, delimiter: string = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.slice(0, Math.max(0, len)) + delimiter + str.substring(strLen - len, strLen) : str
}
