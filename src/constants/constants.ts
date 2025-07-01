// src/constants/constants.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST_ACCOUNT_SIZE = 256
console.log('POST_ACCOUNT_SIZE =', POST_ACCOUNT_SIZE)

export const MAX_CONTENT_LENGTH = 280

// Ces deux-là, si pas utilisés, commentés temporairement :
/*
export const MAX_USERNAME_LENGTH = 32
*/
export const MAX_POST_SIZE = 32 + 8 + 4 + MAX_CONTENT_LENGTH + 8
