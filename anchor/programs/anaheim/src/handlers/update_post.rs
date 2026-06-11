use anchor_lang::prelude::*;

pub use crate::state::post_account::PostAccount;

#[derive(Accounts)]
pub struct UpdatePost<'info> {

  #[account(
        mut,
        realloc = 8 + 32 + 8 + 4 + 280,
        realloc::payer = user,
        realloc::zero = true
  )]
  pub post: Account<'info, PostAccount>,

  #[account(mut)]
  pub user: Signer<'info>,

  pub system_program: Program<'info, System>,
}