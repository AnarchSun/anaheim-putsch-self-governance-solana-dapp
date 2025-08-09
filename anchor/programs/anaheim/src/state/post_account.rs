// FILE: anchor/programs/anaheim/src/state/post_account.rs
use anchor_lang::prelude::*;
use crate::constants::MAX_CONTENT_LENGTH;

#[account]
pub struct PostAccount {
  pub author: Pubkey,
  pub content: [u8; MAX_CONTENT_LENGTH],
  pub content_len: u16,
  pub timestamp: i64,
  pub vote_count: u64, // ✅ 1. Ajoutez le nouveau champ ici
}

impl PostAccount {
  // ✅ 2. Mettez à jour la taille du compte (ajoutez 8 pour le u64)
  pub const SIZE: usize = 8 + 32 + (4 + MAX_CONTENT_LENGTH) + 2 + 8 + 8;
}