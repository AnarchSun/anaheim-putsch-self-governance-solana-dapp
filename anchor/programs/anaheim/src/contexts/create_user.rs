// FILE: anchor/programs/anaheim/src/contexts/create_user.rs
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
    // ✅ FIX: The signer is named `authority` to match the handler's usage.
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}