// File: instructions/mine.rs
// --------------------------
use anchor_lang::prelude::*;
use crate::contexts::mine::Mine;
use crate::handlers::handler_mine::handle_mine;

pub fn mine(ctx: Context<Mine>) -> Result<()> {
    handle_mine(ctx)
}
