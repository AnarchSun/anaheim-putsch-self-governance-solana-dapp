// FILE: anchor/programs/anaheim/src/contexts/increment.rs
use anchor_lang::prelude::*;
use crate::state::AnaheimAccount; // Assurez-vous d'importer votre état de compte

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, has_one = authority)]
    pub anaheim_account: Account<'info, AnaheimAccount>,
    pub authority: Signer<'info>,
}