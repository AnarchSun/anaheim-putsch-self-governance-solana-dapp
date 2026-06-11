// FILE: anchor/programs/anaheim/src/state/user_vote_marker.rs
use anchor_lang::prelude::*;

#[account]
pub struct UserVoteMarker {
  pub user: Pubkey,
  pub post: Pubkey,
  pub has_voted: bool,
  pub is_upvote: bool,
  pub bump: u8, // ✅ SOLUTION : Le champ 'bump' est maintenant ici.
}

impl UserVoteMarker {
  // 8 (discriminator) + 32 (user) + 32 (post) + 1 (has_voted) + 1 (is_upvote) + 1 (bump)
  pub const SIZE: usize = 8 + 32 + 32 + 1 + 1 + 1;
}