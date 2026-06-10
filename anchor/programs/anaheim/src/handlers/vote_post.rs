// FILE: programs/anaheim/src/handlers/vote_post.rs
use anchor_lang::prelude::*;
use super::super::contexts::vote_post::VotePost;
use super::super::error::ErrorCode;

pub fn handler(ctx: Context<VotePost>, _bump: u8, upvote: bool) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let vote_marker = &mut ctx.accounts.vote_marker;

    if vote_marker.has_voted {
        return err!(ErrorCode::AlreadyVoted);
    }

    if upvote {
        post.upvotes = post.upvotes.checked_add(1).ok_or(ErrorCode::Overflow)?;
    } else {
        post.downvotes = post.downvotes.checked_add(1).ok_or(ErrorCode::Overflow)?;
    }

    vote_marker.user = ctx.accounts.authority.key();
    vote_marker.post = post.key();
    vote_marker.is_upvote = upvote;
    vote_marker.has_voted = true;

    Ok(())
}
