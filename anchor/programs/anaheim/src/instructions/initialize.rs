// FILE: anchor/programs/anaheim-old/src/instructions/initialize.rs
use anchor_lang::prelude::*;
<<<<<<< HEAD
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init,
    payer = user,
    space = 8 + AnaheimAccount::SIZE,
    seeds = [b"anaheim", user.key().as_ref()],
    bump
  )]
  pub anaheim: Account<'info, AnaheimAccount>,
=======
use crate::contexts::initialize::Initialize;

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
  let bump = ctx.bumps.anaheim;

  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.bump = bump;
  anaheim.authority = *ctx.accounts.payer.key;
  anaheim.count = 0;
  anaheim.value = 0;
>>>>>>> main

  Ok(())
}
