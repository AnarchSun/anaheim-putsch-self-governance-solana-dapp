// FILE: anchor/programs/anaheim/src/instructions/create_post.rs
use anchor_lang::prelude::*;
use crate::state::post_account::{PostAccount, MAX_CONTENT_LENGTH}; // Use our new state file
use crate::error::ErrorCode;

// Defines the accounts required for our instruction.
#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(
        init,
        payer = user,
        space = 8 + PostAccount::SIZE, // 8-byte discriminator + struct size
  )]
  pub post: Account<'info, PostAccount>,

  #[account(mut)]
  pub user: Signer<'info>,

  pub system_program: Program<'info, System>,
}

// This is the function that holds the logic for the instruction.
pub fn handler(ctx: Context<CreatePost>, content: String) -> Result<()> {
  let post_account = &mut ctx.accounts.post;

  // --- THIS IS THE FIX ---
  // We convert the String to bytes and check its length.
  let content_bytes = content.as_bytes();
  require!(!content.trim().is_empty(), ErrorCode::InvalidContent);
  require!(content_bytes.len() <= MAX_CONTENT_LENGTH, ErrorCode::ContentTooLong);

  // Copy the bytes from the input string into our fixed-size array.
  post_account.content[..content_bytes.len()].copy_from_slice(content_bytes);

  // Set the rest of the fields.
  post_account.content_len = content_bytes.len() as u16;
  post_account.author = ctx.accounts.user.key();
  post_account.timestamp = Clock::get()?.unix_timestamp;
  post_account.vote_count = 0;

  msg!("Post created successfully by {}", ctx.accounts.user.key());

  Ok(())
}