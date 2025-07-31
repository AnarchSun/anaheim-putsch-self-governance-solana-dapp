// FILE: anchor/programs/anaheim/src/instructions/initialize.rs
use anchor_lang::prelude::*;
use crate::state::anaheim_account::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"anaheim", payer.key().as_ref()],
        bump,
        payer = payer,
        space = 8 + AnaheimAccount::SIZE,
    )]
    pub anaheim: Account<'info, AnaheimAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>, bump: u8) -> Result<()> {
    let anaheim = &mut ctx.accounts.anaheim;
    anaheim.bump = bump;
    Ok(())
}
