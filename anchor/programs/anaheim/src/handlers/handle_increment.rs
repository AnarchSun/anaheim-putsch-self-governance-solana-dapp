use anchor_lang::prelude::*;

use crate::instructions::use_anaheim::UseAnaheim;


pub fn handle_increment(ctx: Context<UseAnaheim>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count += 1;
  Ok(())
}

