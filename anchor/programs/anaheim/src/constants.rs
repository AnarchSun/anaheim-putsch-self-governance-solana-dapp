// FILE: anchor/programs/anaheim/src/constants.rs

// Taille max pour les noms d’utilisateur
pub const MAX_USERNAME_LENGTH: usize = 32;

// Taille max du contenu (messages, posts, etc.)
pub const MAX_CONTENT_LENGTH: usize = 280;

// Taille max pour un post complet :
// username (32) + timestamp (8) + longueur (4) + contenu (MAX_CONTENT_LENGTH) + padding (8)
pub const MAX_POST_SIZE: usize = MAX_USERNAME_LENGTH + 8 + 4 + MAX_CONTENT_LENGTH + 8;

// Taille max pour un message court
pub const MAX_MESSAGE_LENGTH: usize = 280;
