// FILE: anchor/programs/anaheim/src/lib.rs
// VERSION FINALE ET COMPLÈTE ADAPTÉE À VOTRE STRUCTURE
#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

// 1. Déclarez TOUS les modules pertinents de votre dossier `src'.
//    Ceci permet à `lib.rs` de "voir" le code dans ces dossiers.
pub mod contexts;
pub mod handlers;
pub mod state;
pub mod error;
pub mod constants;
pub mod utils;
// Le module `close` est aussi déclaré, au cas où vous en auriez besoin.
pub mod close;
pub mod validate_post_content;
pub mod post;
// 2. Importez explicitement CHAQUE contexte et CHAQUE handler que vos instructions vont utiliser.
//    C'est la méthode la plus sûre pour éviter les erreurs.

use contexts::increment::*;
// Imports depuis le module `contexts`
use contexts::initialize::*;
use contexts::create_post::*;
// Note : Il n'y a pas de `decrement.rs` ou `set.rs` dans votre dossier `contexts',
// donc ces instructions ne peuvent pas être ajoutées pour l'instant.
use contexts::create_user::*;
use handlers::handle_create_post::handle_create_post;
use handlers::handle_create_user::handle_create_user;
use handlers::increment_handler::increment_handler;
use handlers::initialize_handler::initialize_handler;
// J'ai supposé ce nom


// 3. L'ID de votre programme.
declare_id!("6qUyfHoKhZ3hbHQ5PqdfgRD15nEiVnJUDeNhmCmjSYAH");


// 4. Le module principal du programme.
#[program]
pub mod anaheim {
  use super::*;
  // Rend les imports ci-dessus disponibles à l'intérieur de ce module

  // --- INSTRUCTIONS PUBLIQUES ---
  // Chaque fonction ici est un "endpoint" public de votre programme.

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    initialize_handler(ctx)
  }

  pub fn increment(ctx: Context<Increment>) -> Result<()> {
    increment_handler(ctx)
  }

  // Pour que 'decrement' fonctionne, vous devez créer `contexts/decrement.rs`
  // pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
  //     decrement_handler(ctx)
  // }

  pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
    handle_create_user(ctx, username)
  }

  pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    handle_create_post(ctx, content)
  }

  // ... vous pouvez ajouter d'autres instructions ici de la même manière…
}