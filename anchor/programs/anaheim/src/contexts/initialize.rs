// FILE: anchor/programs/anaheim/src/contexts/initialize.rs
// VERSION FINALE ET CORRECTE

use anchor_lang::prelude::*;
use crate::state::AnaheimAccount; // Assurez-vous que le chemin vers votre état est correct

#[derive(Accounts)]
pub struct Initialize<'info> {
    // 1. Le compte principal du programme à initialiser
    #[account(
        init, // Indique que nous créons ce compte
        payer = payer, // 'payer` est celui qui paie les frais
        space = AnaheimAccount::SIZE, // L'espace à allouer pour le compte
        seeds = [b"anaheim", payer.key().as_ref()], // Les seeds pour le PDA
        bump // Anchor va trouver et fournir la bump
    )]
    pub anaheim_account: Account<'info, AnaheimAccount>,

    // 2. Le payeur (celui qui signe et paie les frais).
    #[account(mut)]
    pub payer: Signer<'info>,

    // 3. Le programme système, requis pour créer un compte ('init`)
    pub system_program: Program<'info, System>,

    // ✅ FIX : La ligne invalide "pub anaheim: place!(...)" a été complètement supprimée.
}