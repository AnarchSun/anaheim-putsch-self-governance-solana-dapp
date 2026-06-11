use anchor_lang::prelude::*;

use crate::contexts::create_post::CreatePost;
use crate::error::ErrorCode;

pub fn handle_create_post(
    ctx: Context<CreatePost>,
    content: String,
) -> Result<()> {
    require!(!content.trim().is_empty(), ErrorCode::EmptyContent);
    require!(content.len() <= 280, ErrorCode::ContentTooLong);

    let post = &mut ctx.accounts.post;
    let user_profile = &mut ctx.accounts.user_profile;

    post.author = ctx.accounts.user.key();
    post.timestamp = Clock::get()?.unix_timestamp;

    let content_bytes = content.as_bytes();

    post.content.fill(0);
    post.content[..content_bytes.len()].copy_from_slice(content_bytes);
    post.content_len = content_bytes.len() as u16;

    user_profile.post_count = user_profile
        .post_count
        .checked_add(1)
        .ok_or(ErrorCode::Overflow)?;

    msg!(
        "Post created! User now has {} posts.",
        user_profile.post_count
    );

    Ok(())
}