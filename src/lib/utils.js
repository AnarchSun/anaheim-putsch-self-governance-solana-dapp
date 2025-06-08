import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function ellipsify(string_ = '', length = 4, delimiter = '..') {
    const stringLength = string_.length;
    const limit = length * 2 + delimiter.length;
    return stringLength >= limit ? string_.slice(0, Math.max(0, length)) + delimiter + string_.substring(stringLength - length, stringLength) : string_;
}
