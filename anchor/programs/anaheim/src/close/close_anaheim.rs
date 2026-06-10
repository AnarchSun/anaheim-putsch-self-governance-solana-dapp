// Dans close_anaheim.rs
use anchor_lang::prelude::*;
use crate::state::anaheim_account::AnaheimAccount;

#[derive(Accounts)]
pub struct CloseAnaheim<'info> {
  #[account(mut, close = authority)]
  pub anaheim: Account<'info, AnaheimAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(_ctx: Context<CloseAnaheim>) -> Result<()> {
  msg!("Closing Anaheim account...");
  Ok(())
}
