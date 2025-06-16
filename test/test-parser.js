import tsParser from '@typescript-eslint/parser'

console.log('parser:', tsParser)
console.log('has parse:', typeof tsParser.parse === 'function')
console.log('has parseForESLint:', typeof tsParser.parseForESLint === 'function')
