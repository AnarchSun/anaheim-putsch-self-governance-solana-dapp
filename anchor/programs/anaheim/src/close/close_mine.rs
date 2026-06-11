// programs/anaheim/src/close/close_mine.rs
use anchor_lang::prelude::*;

use crate::state::post_account::PostAccount;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct CloseMine<'info> {
  #[account(
        mut,
        close = author,
        has_one = author @ ErrorCode::Unauthorized
  )]
  pub post: Account<'info, PostAccount>,

  #[account(mut)]
  pub author: Signer<'info>,
}

pub fn handle_close_mine(_ctx: Context<CloseMine>) -> Result<()> {
  // Pas besoin de logique si tout est dans le macro derive
  Ok(())
}
