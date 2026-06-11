// FILE: anchor/programs/anaheim/src/contexts/decrement.rs
// CONTEXTE DÉDIÉ POUR L'INSTRUCTION DECREMENT

use anchor_lang::prelude::*;
use crate::state::AnaheimAccount; // Assurez-vous que le chemin est correct

#[derive(Accounts)]
pub struct Decrement<'info> {
    // On a besoin de modifier le compte, donc `mut'.
    // On vérifie que le signataire est bien l'autorité du compte.
    #[account(mut, has_one = authority)]
    pub anaheim_account: Account<'info, AnaheimAccount>,
    pub authority: Signer<'info>,
}