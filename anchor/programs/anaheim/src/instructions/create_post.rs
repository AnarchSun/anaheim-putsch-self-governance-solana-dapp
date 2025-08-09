// FILE: anchor/programs/anaheim/src/instructions/create_post.rs
// VERSION FINALE ET AUTONOME

use anchor_lang::prelude::*;
use crate::state::PostAccount; // Importe la structure de l'état du compte
use crate::constants::MAX_CONTENT_LENGTH;
use crate::error::ErrorCode;

// --- CONTEXTE DE L'INSTRUCTION ---
// Définit tous les comptes nécessaires pour cette instruction.
#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(
        init,
        payer = user,
        space = PostAccount::SIZE,
        seeds = [b"post", user.key().as_ref(), clock.unix_timestamp.to_string().as_ref()],
        bump
  )]
  pub post_account: Account<'info, PostAccount>,

  #[account(mut)]
  pub user: Signer<'info>,

  pub system_program: Program<'info, System>,

  // On a besoin de la Clock pour le timestamp
  pub clock: Sysvar<'info, Clock>,
}

// --- HANDLER (LOGIQUE) DE L'INSTRUCTION ---
// C'est la fonction qui sera appelée par `lib.rs'.
pub fn create_post_handler(ctx: Context<CreatePost>, content: String) -> Result<()> {
  let post_account = &mut ctx.accounts.post_account;
  let user = &ctx.accounts.user;
  let clock = &ctx.accounts.clock;

  let content_bytes = content.as_bytes();

  // Validations
  require!(!content.trim().is_empty(), ErrorCode::InvalidContent);
  require!(content_bytes.len() <= MAX_CONTENT_LENGTH, ErrorCode::ContentTooLong);

  // Initialisation des champs du compte
  post_account.author = user.key();
  post_account.timestamp = clock.unix_timestamp;
  post_account.content_len = content_bytes.len() as u16;
  post_account.content[..content_bytes.len()].copy_from_slice(content_bytes);
  post_account.vote_count = 0; // Initialisation du nouveau champ
  post_account.bump = ctx.bumps.post_account; // Sauvegarde de la bump

  msg!("Post créé par {} à {}", user.key(), clock.unix_timestamp);

  Ok(())
}