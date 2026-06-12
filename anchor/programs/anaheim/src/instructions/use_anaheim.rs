use anchor_lang::prelude::*;
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct UseAnaheim<'info> {
  #[account(mut)]
  pub anaheim_account: Account<'info, AnaheimAccount>,

  pub user: Signer<'info>,
}

pub fn handler(ctx: Context<UseAnaheim>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim_account;

  anaheim.count += 1;

  Ok(())
}