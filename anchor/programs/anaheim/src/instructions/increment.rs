// FILE: src/instructions/increment.rs
use anchor_lang::prelude::*;
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, has_one = authority)]
    pub anaheim_account: Account<'info, AnaheimAccount>,
    pub authority: Signer<'info>,
}

pub fn increment_handler(ctx: Context<Increment>) -> Result<()> {
    ctx.accounts.anaheim_account.count = ctx.accounts.anaheim_account.count.checked_add(1).unwrap();
    Ok(())
}