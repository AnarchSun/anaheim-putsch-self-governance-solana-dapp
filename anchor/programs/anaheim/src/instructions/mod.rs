// === instructions/create_post.rs ===
use anchor_lang::prelude::*;

use crate::state::post_account::PostAccount; // <- IMPORT DIRECT
pub mod vote_post;
pub mod use_anaheim;
pub mod update;
pub mod decrement;
pub mod create_post;
pub mod initialize;
pub mod mine;
pub mod set_data;
pub mod increment;

pub use use_anaheim::*;
pub use set_data::*;
pub use increment::*;
pub use anchor_lang::system_program::System;
pub use anchor_lang::Accounts;
pub use anchor_lang::prelude::{Account, Program, Signer};
use crate::constants::MAX_CONTENT_LENGTH;

#[account]
pub struct Anaheim {
  pub authority: Pubkey,
  pub count: u64,
  pub value: u8,
}

impl Anaheim {
  pub const SIZE: usize = 8 + 32 + 8 + 1;
}

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
