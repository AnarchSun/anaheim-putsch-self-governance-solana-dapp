use anchor_lang::prelude::*;
use crate::contexts::update::UpdatePost;
use crate::error::ErrorCode;

pub fn handle_update_post(
    ctx: Context<UpdatePost>,
    new_content: String,
) -> Result<()> {
    require!(!new_content.trim().is_empty(), ErrorCode::EmptyContent);
    require!(new_content.len() <= 280, ErrorCode::ContentTooLong);

    let post = &mut ctx.accounts.post;

    let bytes = new_content.as_bytes();

    post.content.fill(0);
    post.content[..bytes.len()].copy_from_slice(bytes);
    post.content_len = bytes.len() as u16;

    post.timestamp = Clock::get()?.unix_timestamp;

    Ok(())
}