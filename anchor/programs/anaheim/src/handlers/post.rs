use anchor_lang::prelude::*;
use crate::contexts::post::CreatePost;
use crate::error::ErrorCode;

pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    require!(!content.is_empty(), ErrorCode::EmptyContent);

    let post = &mut ctx.accounts.post;

    let bytes = content.as_bytes();
    post.content[..bytes.len()].copy_from_slice(bytes);
    post.content_len = bytes.len() as u16;

    post.author = ctx.accounts.user.key();
    post.timestamp = Clock::get()?.unix_timestamp;
    post.vote_count = 0;

    Ok(())
}