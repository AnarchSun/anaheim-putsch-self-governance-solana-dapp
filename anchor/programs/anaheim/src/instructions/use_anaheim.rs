use anchor_lang::prelude::*;

use crate::state::anaheim_account::AnaheimAccount;

#[derive(Accounts)]
pub struct UseAnaheim<'info> {
  #[account(mut)]
  pub anaheim: Account<'info, AnaheimAccount>,
  pub user: Signer<'info>,
}

pub fn handler(ctx: Context<UseAnaheim>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count += 1;
  msg!("Anaheim used. Count is now {}", anaheim.count);
  Ok(())
}
