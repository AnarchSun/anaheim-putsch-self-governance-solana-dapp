// programs/anaheim/src/handlers/close.rs
use anchor_lang::prelude::*;
pub use crate::close::close_post;
use crate::close::close_account;

pub fn close_post_account(_ctx: Context<CloseAccount>) -> Result<()> {
    // Anchor va automatiquement close le compte car tu utilises `#[account(close = user)]`
    Ok(())
}
