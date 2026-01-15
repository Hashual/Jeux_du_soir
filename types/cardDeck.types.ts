// Types pour la gestion des jeux de cartes personnalisés

export type CardValue = 'As' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Valet' | 'Reine' | 'Roi';
export type CardSuit = 'Coeur' | 'Carreau' | 'Trèfles' | 'Pique';

// Image associée à une carte
export interface CardImage {
  id: string;
  uri: string; // Chemin local de l'image
  value: CardValue;
  suit?: CardSuit; // Optionnel car on peut avoir des images sans couleur spécifique
}

// Un jeu de cartes complet avec ses images personnalisées
export interface CardDeck {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  images: CardImage[];
  isDefault?: boolean; // Le jeu par défaut utilise les icônes standards
}

// Configuration globale
export interface CardDecksConfig {
  decks: CardDeck[];
  activeDeckId: string | null; // Le jeu de cartes actuellement sélectionné
}
