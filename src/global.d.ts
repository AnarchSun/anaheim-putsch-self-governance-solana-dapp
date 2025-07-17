// FILE: src/global.d.ts

/**
 * This file is for global TypeScript declarations.
 * TypeScript automatically includes any `.d.ts` files in its compilation.
 */
declare global {
  interface BigInt {
    /**
     * Enables BigInt to be serialized by JSON.stringify()
     */
    toJSON(): string;
  }
}

// This empty export statement turns the file into a module.
export {};