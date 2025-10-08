// PATH: src/scripts/findStakeAccountPda.js
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// -- paramètres ------------------------------
const RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
const USER_WALLET = 'BMroEfivj7NKTHrsQXbrAEeH4sneBnP7yC5ykwpWSDqk';
const PROGRAM_ID  = '7q7nTMKnrAvKUMGQejYD6HHNnJDKCtZW7QKHD7entVU4'; // même que declare_id!

// -- script ---------------------------------
const connection = new Connection(RPC_URL, 'confirmed');
const userKey = new PublicKey(USER_WALLET);
const [stakePda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake'), userKey.toBuffer()],
    new PublicKey(PROGRAM_ID)
);

console.log('Stake PDA :', stakePda.toBase58(), 'bump:', bump);

const info = await connection.getAccountInfo(stakePda);
console.log(info ? 'Compte existe déjà' : 'Aucun compte à cette adresse');
