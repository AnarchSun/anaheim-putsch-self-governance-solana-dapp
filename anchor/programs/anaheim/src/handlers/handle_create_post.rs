use anchor_lang::prelude::*;
pub use crate::contexts::create_post::CreatePost;

pub fn handle_create_post(_ctx: Context<CreatePost>) -> Result<()> {
    // Post logic
    Ok(())
}
