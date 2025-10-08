// FILE: state/user_vote_marker.rs
use anchor_lang::prelude::*;

#[account]
pub struct UserVoteMarker {
<<<<<<< HEAD
  pub user: Pubkey,
  pub post: Pubkey,
  pub is_upvote: bool,
  pub has_voted: bool, // Add this field
  pub bump: u8,
=======
  pub has_voted: bool,
  pub is_upvote: bool,
  pub post: Pubkey,
  pub user: Pubkey,
>>>>>>> main
}

impl UserVoteMarker {
  pub const SIZE: usize = 8 + (32 * 2) + 1 + 1;
}
