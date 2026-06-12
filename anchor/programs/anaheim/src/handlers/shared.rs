// FILE: anchor/programs/anaheim/src/handlers/shared.rs
// VERSION FINALE ET CORRIGÉE

use anchor_lang::prelude::*;
pub use crate::state::post::Post;
// Imports des contextes nécessaires par les handlers de ce
use crate::contexts::{CreateUser, CreatePost, UpdatePost};
use crate::error::ErrorCode;
use crate::constants::{MAX_USERNAME_LENGTH, MAX_CONTENT_LENGTH};


// --- HANDLERS D'INSTRUCTIONS
pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
  let user_account = &mut ctx.accounts.user_account;

  // ✅ FIX : Le contexte `CreateUser` a un champ `authority', pas `user`.
  // ✅ FIX : On appelle la méthode .key() avec des parenthèses.
  user_account.authority = ctx.accounts.authority.key();
  user_account.timestamp = Clock::get()?.unix_timestamp;
  user_account.bump = ctx.bumps.user_account;

  // Logique pour copier le String dans un tableau de taille fixe
  let name_bytes = username.as_bytes();
  require!(name_bytes.len() <= MAX_USERNAME_LENGTH, ErrorCode::UsernameTooLong);
  user_account.username_len = name_bytes.len() as u8;
  // ✅ FIX : Assurez-vous que `UserAccount` a un champ `username: [u8; MAX_USERNAME_LENGTH]`
  user_account.username[..name_bytes.len()].copy_from_slice(name_bytes);

  msg!("User created: {}", username);
  Ok(())
}

pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
  let post_account = &mut ctx.accounts.post;

  // ✅ FIX : Le contexte `CreatePost` a un champ `user` (le Signer), pas `author`.
  post_account.author = ctx.accounts.user.key();

  // ✅ FIX : Le champ doit s'appeler `timestamp`, pas `created_at`.
  // Assurez-vous que votre struct `PostAccount` a bien un champ `timestamp: i64`.
  post_account.timestamp = Clock::get()?.unix_timestamp;

  // Logique pour copier le String dans un tableau de taille fixe
  let content_bytes = content.as_bytes();
  require!(content_bytes.len() <= MAX_CONTENT_LENGTH, ErrorCode::ContentTooLong);
  post_account.content_len = content_bytes.len() as u16;
  // ✅ FIX : Assurez-vous que `PostAccount` a `content: [u8; MAX_CONTENT_LENGTH]` et non 1024.
  post_account.content[..content_bytes.len()].copy_from_slice(content_bytes);

  msg!("Post created: {}", content);
  Ok(())
}
