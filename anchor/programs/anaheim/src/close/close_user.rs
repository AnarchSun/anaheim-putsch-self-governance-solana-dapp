use anchor_lang::prelude::*;
use crate::state::user_account::UserAccount;

#[derive(Accounts)]
pub struct CloseUser<'info> {
  #[account(mut, close = authority)]
  pub user_account: Account<'info, UserAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn close_user(ctx: Context<CloseUser>) -> Result<()> {
  msg!("Closing user account for authority: {}", ctx.accounts.authority.key());
  Ok(())
}
