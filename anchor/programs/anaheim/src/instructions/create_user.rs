use anchor_lang::prelude::*;

use crate::contexts::create_user::CreateUser;
use crate::handlers::handle_create_user::handle_create_user;

pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
  handle_create_user(ctx, username)
}
