// FILE: anchor/programs/anaheim/src/contexts/create_user.rs
// C'EST LA SEULE VERSION DE CETTE STRUCT QUI DOIT EXISTER

use anchor_lang::prelude::*;
use crate::state::UserAccount;

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = authority,
        space = UserAccount::SIZE,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}