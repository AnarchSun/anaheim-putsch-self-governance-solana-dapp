// === instructions/initialize.rs ou contexts/initialize.rs ===
use anchor_lang::prelude::*;
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

  #[account(mut)]
  pub user: Signer<'info>,

  pub system_program: Program<'info, System>,
}
