pub fn string_to_fixed(s: &String) -> [u8; 280] {
    let bytes = s.as_bytes();
    let mut fixed = [0u8; 280];
    let len = bytes.len().min(280);
    fixed[..len].copy_from_slice(&bytes[..len]);
    fixed
}
