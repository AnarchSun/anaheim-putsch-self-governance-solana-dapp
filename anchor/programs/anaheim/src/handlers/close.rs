<<<<<<< HEAD
// programs/anaheim/src/handlers/close.rs
=======
// programs/anaheim-old/src/handlers/close.rs
>>>>>>> main
use anchor_lang::prelude::*;
pub use crate::close::close_post::ClosePost;
use crate::close::CloseAccount;

pub fn close_post_account(_ctx: Context<CloseAccount>) -> Result<()> {
    // Anchor va automatiquement close le compte car tu utilises `#[account(close = user)]`
    Ok(())
}
