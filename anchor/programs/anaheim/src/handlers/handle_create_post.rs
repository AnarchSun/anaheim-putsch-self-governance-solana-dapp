use anchor_lang::prelude::*;
use crate::contexts::CreatePost;

pub fn handle_create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    // Post logic
    Ok(())
}
