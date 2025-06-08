use anchor_lang::prelude::*;
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init,
    payer = payer,
    space = 8 + AnaheimAccount::SIZE,
    seeds = [b"anaheim", payer.key().as_ref()],
    bump
  )]
  pub anaheim_account: Account<'info, AnaheimAccount>,

  #[account(mut)]
  pub payer: Signer<'info>,

  pub system_program: Program<'info, System>,
}
