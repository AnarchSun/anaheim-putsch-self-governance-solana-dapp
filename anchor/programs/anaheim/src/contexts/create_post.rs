// ===================== contexts/create_post.rs =====================
use anchor_lang::prelude::*;

use crate::state::PostAccount;

#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(
        init,
        payer = user,
        space = 8 + PostAccount::SIZE,
        seeds = [b"post", user.key().as_ref(), clock.unix_timestamp.to_le_bytes().as_ref()],
        bump
  )]
  pub post_account: Account<'info, PostAccount>,

  #[account(mut)]
  pub user: Signer<'info>,

  // <- C'est ici que tu dois déclarer le system_program
  pub system_program: Program<'info, System>,

  pub clock: Sysvar<'info, Clock>,
}
