// FILE: anchor/programs/anaheim/src/instructions/initialize.rs
use crate::contexts::initialize;
use anchor_lang::prelude::*;
use crate::contexts;
use crate::handlers::initialize_handler::initialize_handler;
use crate::state::anaheim;
use crate::state::anaheim_account::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + AnaheimAccount::INIT_SPACE,
        seeds = [b"anaheim", payer.key().as_ref()],
        bump,
    )]
    pub anaheim: Account<'info, AnaheimAccount>, // <-- name is "anaheim"
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>, bump: u8) -> Result<()> {
    let anaheim = &mut ctx.accounts.anaheim;
    anaheim.bump = bump;
    Ok(())
}
pub fn initialize(ctx: Context<initialize::Initialize>, bump: u8) -> Result<()>{
    initialize_handler(ctx, bump)
}
