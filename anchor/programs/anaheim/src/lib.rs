// FILE: anchor/programs/anaheim/src/lib.rs
#![allow(unexpected_cfgs)]
#[allow(deprecated)]
use anchor_lang::prelude::*;

pub mod contexts;
pub mod handlers;
pub mod state;
pub mod error;
pub mod constants;
pub mod utils;
pub mod close;
pub mod validate_post_content;

use contexts::create_user::*;
use contexts::create_post::*;
use contexts::initialize::*;
use contexts::increment::*;
use contexts::decrement::*;
use handlers::increment_handler::increment_handler;
use handlers::initialize_handler;
use crate::handlers::{decrement_handler, handle_create_post, handle_create_user};

declare_id!("FSyJ9EGkBerkZB6C1DSzDkcmjzohhvydb22FfQptbYQH");
// 4. Le module principal du programme.
#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    initialize_handler::initialize_handler(ctx)
  }

  pub fn increment(ctx: Context<Increment>) -> Result<()> {
    increment_handler(ctx)
  }

  // Pour que 'decrement' fonctionne, vous devez créer `contexts/decrement.rs`
   pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
       decrement_handler(ctx)
   }

  pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
    handle_create_user::create_user(ctx, username)
  }

  // This instruction now correctly delegates to the handler that does the resizing.
  pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    handle_create_post::handle_create_post(ctx, content)
  }

}