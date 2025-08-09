// ===================== contexts/create_post.rs =====================
use anchor_lang::prelude::*;
use crate::constants::MAX_CONTENT_LENGTH;
use crate::state::PostAccount;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(
        init,
        payer = user,
        space = 8 + PostAccount::SIZE,
        seeds = [b"post", user.key().as_ref(), clock.unix_timestamp.to_le_bytes().as_ref()],
        bump
  )]
  pub post_account: Account<'info, PostAccount>,

  #[account(mut)]
  pub user: Signer<'info>,

  // <- C'est ici que tu dois déclarer le system_program
  pub system_program: Program<'info, System>,

  pub clock: Sysvar<'info, Clock>,
}
// Dans votre fonction create_post

pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    let post_account = &mut ctx.accounts.post_account;
    let content_bytes = content.as_bytes();

    require!(content_bytes.len() <= MAX_CONTENT_LENGTH, ErrorCode::ContentTooLong);

    post_account.author = *ctx.accounts.user.key;
    post_account.content_len = content_bytes.len() as u16;
    post_account.content[..content_bytes.len()].copy_from_slice(content_bytes);
    post_account.timestamp = Clock::get()?.unix_timestamp;

    // ✅ 3. Initialisez le compteur de votes à zéro lors de la création
    post_account.vote_count = 0;

    Ok(())
}