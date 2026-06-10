// --------------------------
// Example utility for validating mining eligibility
use anchor_lang::prelude::*;

pub fn can_mine(_user: &Pubkey) -> bool {
  // Add logic e.g. time-based mining rate limits
  true
}
