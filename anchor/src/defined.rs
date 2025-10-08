// anarcrypt.sol/anaheim-old-putsch-self-governance-solana-dapp/anchor/src/defined.rs
use std::path::PathBuf;
use anyhow::{anyhow, Result};

use super::{common::find_path, external::get_external_type};
use crate::parser::context::CrateContext;

/// Safe and stable way to parse crate context using lib.rs or main.rs
pub fn get_crate_context() -> Result<CrateContext> {
    // 🛡️ Récupère le chemin du dossier du projet via var d'env
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
        .map_err(|_| anyhow!("CARGO_MANIFEST_DIR not set"))?;

    // 📍 Chemin par défaut
    let source_path = PathBuf::from(&manifest_dir).join("src/lib.rs");

    // 🔁 Clone le chemin pour `find_path`
    let source_path_clone = source_path.clone();

    // 🪙 Si lib.rs existe, on le garde, sinon fallback sur main.rs
    let _lib_path = if source_path.exists() {
        source_path
    } else {
        PathBuf::from(&manifest_dir).join("src/main.rs")
    };

    // 🧠 On cherche le chemin absolu de lib.rs
    let lib_path = find_path("lib.rs", &source_path_clone)
        .ok_or_else(|| anyhow!("lib.rs not found"))?;

    // 🧬 On parse le contexte du crate
    CrateContext::parse(lib_path)
}
