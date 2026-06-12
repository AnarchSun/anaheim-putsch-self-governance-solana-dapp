use anchor_lang::prelude::*;
use crate::contexts::update::UpdatePost;
use crate::error::ErrorCode;

pub fn update_post(ctx: Context<UpdatePost>, new_content: String) -> Result<()> {
  let post = &mut ctx.accounts.post;

  require!(!new_content.is_empty(), ErrorCode::EmptyContent);

  let bytes = new_content.as_bytes();

  post.content.fill(0);
  post.content[..bytes.len()].copy_from_slice(bytes);
  post.content_len = bytes.len() as u16;
  post.timestamp = Clock::get()?.unix_timestamp;

  Ok(())
}