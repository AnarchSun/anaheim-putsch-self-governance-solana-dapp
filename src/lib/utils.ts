// FILE: src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine les classes Tailwind en évitant les doublons/conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Tronque une chaîne au format « début..fin » si elle dépasse la longueur définie.
 *
 * @param str - Chaîne à tronquer.
 * @param len - Nombre de caractères à conserver au début et à la fin.
 * @param delimiter - Séparateur à insérer entre le début et la fin.
 */
export function ellipsify(str: string = '', len: number = 4, delimiter: string = '..'): string {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit
      ? str.slice(0, Math.max(0, len)) + delimiter + str.slice(strLen - len)
      : str
}
