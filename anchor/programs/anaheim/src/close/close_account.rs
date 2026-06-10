// close/close_account.rs
use anchor_lang::prelude::*;
use crate::state::post_account::PostAccount;

#[derive(Accounts)]
pub struct CloseAccount<'info> {
  #[account(mut, close = user)]
  pub post_account: Account<'info, PostAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}
