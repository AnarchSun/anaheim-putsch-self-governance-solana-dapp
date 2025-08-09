// FILE: anchor/programs/anaheim/src/handlers/shared.rs
// VERSION FINALE ET CORRIGÉE

use anchor_lang::prelude::*;

// Imports des contextes nécessaires par les handlers de ce fichier
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
  let post_account = &mut ctx.accounts.post_account;

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


// NOTE : Les 3 handlers suivants utilisent le même contexte `UpdatePost'.
// C'est possible, mais assurez-vous que `UpdatePost` contient bien `anaheim : Account<'info, AnaheimAccount>`.

pub fn set_value(ctx: Context<UpdatePost>, value: u8) -> Result<()> {
  let anaheim_account = &mut ctx.accounts.anaheim;

  // ✅ Ceci est correct et va maintenant compiler, car 'value' est un champ.
  anaheim_account.value = value;

  Ok(())
}

pub fn increment(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count = anaheim.count.checked_add(1).ok_or(ErrorCode::Overflow)?;
  Ok(())
}

pub fn decrement(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count = anaheim.count.checked_sub(1).ok_or(ErrorCode::Underflow)?;
  Ok(())
}

// NOTE : Vous avez `increment` et `handle_increment'. C'est redondant.
// Je commente `handle_increment` car il semble moins correct (incrémente `value` au lieu de `count').
/*
pub fn handle_increment(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.value = anaheim.value.checked_add(1).unwrap_or(anaheim.value);
  Ok(())
}
*/