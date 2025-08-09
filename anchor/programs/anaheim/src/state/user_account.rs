// FILE: anchor/programs/anaheim/src/state/user_account.rs
// VERSION FINALE ET CORRECTE

use anchor_lang::prelude::*;
use crate::constants::MAX_USERNAME_LENGTH; // Assurez-vous d'avoir ce fichier

#[account]
pub struct UserAccount {
  pub authority: Pubkey,
  pub username: [u8; MAX_USERNAME_LENGTH], // On utilise un tableau de taille fixe
  pub username_len: u8,
  pub timestamp: i64,
  pub bump: u8,
}

impl UserAccount {
  // On calcule la taille totale: 8 (discriminator) + 32 (authority) + 32 (username) + 1 (len) + 8 (timestamp) + 1 (bump)
  pub const SIZE: usize = 8 + 32 + MAX_USERNAME_LENGTH + 1 + 8 + 1;
}