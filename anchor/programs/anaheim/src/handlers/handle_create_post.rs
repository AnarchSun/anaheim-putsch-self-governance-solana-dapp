// FILE: anchor/programs/anaheim/src/handlers/handle_create_post.rs
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::contexts::create_post::CreatePost;
use crate::error::ErrorCode;

pub fn handle_create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    require!(!content.is_empty(), ErrorCode::EmptyContent);
    require!(content.len() <= 280, ErrorCode::ContentTooLong);

    // ✅ FIX: Get each account from its own distinct field in the context.
    let post = &mut ctx.accounts.post;
    let user_profile = &mut ctx.accounts.user_profile;
    let user = &ctx.accounts.user;

    // --- Account Resizing Logic (This part is correct) ---
    let new_account_size = 8 + 32 + 8 + 4 + content.len(); // Discriminator + Author + Timestamp + Len + Content

    let lamports_required = Rent::get()?
        .minimum_balance(new_account_size)
        .saturating_sub(post.to_account_info().lamports());

    if lamports_required > 0 {
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: user.to_account_info(),
                    to: post.to_account_info(),
                },
            ),
            lamports_required,
        )?;
    }

    // The second argument `0x00` is the filler byte for the new space.
    post.to_account_info().resize(new_account_size)?;

    // --- Storing Data ---
    post.author = user.key();
    post.timestamp = Clock::get()?.unix_timestamp;
    // ✅ FIX: This assignment now works because we will define the `post.content`
    // field as a `String` in the state struct.
    let content_bytes = content.as_bytes();
    require!(content_bytes.len() <= 280, ErrorCode::ContentTooLong);

    post.content[..content_bytes.len()].copy_from_slice(content_bytes);
    post.content_len = content_bytes.len() as u16;

    // --- Increment User's Post-Count ---
    // This now works because `user_profile` is a `UserAccount` which has `post_count`.
    user_profile.post_count = user_profile.post_count.checked_add(1).unwrap();

    msg!("Post created! User {} now has {} posts.", user.key(), user_profile.post_count);
    Ok(())
}