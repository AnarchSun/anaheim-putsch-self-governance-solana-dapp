// ===================== contexts/update.rs =====================
use anchor_lang::prelude::*;
use crate::state::{PostAccount, AnaheimAccount};

#[derive(Accounts)]
pub struct UpdatePost<'info> {
  #[account(mut)]
  pub post: Account<'info, PostAccount>,

  #[account(mut)]
  pub anaheim: Account<'info, AnaheimAccount>,

  #[account(mut)]
  pub user: Signer<'info>,

  pub system_program: Program<'info, System>,
}