use anchor_lang::prelude::*;

#[derive(Clone, AnchorSerialize, AnchorDeserialize, Default)]
pub struct Username {
    pub data: [u8; 32],
    pub len: u8,
}