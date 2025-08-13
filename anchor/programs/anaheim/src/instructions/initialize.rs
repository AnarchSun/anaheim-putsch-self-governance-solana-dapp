// FILE: src/instructions/initialize.rs
use anchor_lang::prelude::*;
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = AnaheimAccount::SIZE, seeds = [b"anaheim"], bump)]
    pub anaheim_account: Account<'info, AnaheimAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
    ctx.accounts.anaheim_account.authority = ctx.accounts.payer.key();
    ctx.accounts.anaheim_account.value = ctx.bumps.anaheim_account;
    ctx.accounts.anaheim_account.count = 0;
    Ok(())
}