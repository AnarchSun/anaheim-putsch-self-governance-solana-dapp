// FILE: anchor/programs/anaheim/src/instructions/create_post.rs
use anchor_lang::prelude::*;

use crate::state::post_account::PostAccount;
use crate::constants::MAX_CONTENT_LENGTH;

#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(
        init,
        payer = user,
        space = 8 + 4 + MAX_CONTENT_LENGTH + 64 + 8 + 4
  )]
  pub post: Account<'info, PostAccount>,

  #[account(mut)]
  pub user: Signer<'info>,

  pub system_program: Program<'info, System>,
}