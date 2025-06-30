use anchor_lang::prelude::*;
use crate::state::{PostAccount, UserVoteMarker};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct VotePost<'info> {
  #[account(mut)]
  pub user: Signer<'info>,

  #[account(
        mut,
        has_one = author @ ErrorCode::InvalidAuthority,
  )]
  pub post: Account<'info, PostAccount>,
    
  pub vote_marker: Account<'info, UserVoteMarker>,

  /// CHECK: Ce champ est juste comparé par clé
  pub author: AccountInfo<'info>,

  pub system_program: Program<'info, System>,
}

impl<'info> VotePost<'info> {
  pub fn validate(&self) -> Result<()> {
    require!(!self.vote_marker.has_voted, ErrorCode::AlreadyVoted);
    Ok(())
  }
}

pub fn handler(ctx: Context<VotePost>, _bump: u8, upvote: bool) -> Result<()> {
  ctx.accounts.validate()?;

  let post = &mut ctx.accounts.post;
  let vote_marker = &mut ctx.accounts.vote_marker;

  // Comptage des votes
  if upvote {
    post.vote_count = post.vote_count.checked_add(1).ok_or(ErrorCode::Overflow)?;
  } else {
    post.vote_count = post.vote_count.saturating_sub(1);
  }

  // Mise à jour du marqueur de vote
  vote_marker.has_voted = true;
  vote_marker.is_upvote = upvote;
  vote_marker.post = post.key();
  vote_marker.user = ctx.accounts.user.key();

  Ok(())
}
