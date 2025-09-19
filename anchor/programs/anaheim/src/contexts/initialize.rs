// FILE: anchor/programs/anaheim-old/src/contexts/initialize.rs
use anchor_lang::prelude::*;
use crate::state::anaheim_account::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        seeds = [b"anaheim-old", payer.key().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<AnaheimAccount>()
    )]
    pub anaheim: Account<'info, AnaheimAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
