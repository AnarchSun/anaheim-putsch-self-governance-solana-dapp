// ===================== contexts/update.rs =====================
use anchor_lang::prelude::*;
use crate::state::anaheim_account::AnaheimAccount;

#[derive(Accounts)]
pub struct UpdatePost<'info> {
  #[account(mut)]
  pub anaheim: Account<'info, AnaheimAccount>,
}
