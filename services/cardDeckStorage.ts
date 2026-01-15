import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { CardDeck, CardDecksConfig, CardImage, CardValue, CardSuit } from '@/types/cardDeck.types';

const STORAGE_KEY = '@card_decks_config';
const CARD_DECKS_DIR = `${FileSystem.documentDirectory}cardDecks/`;

// Initialiser le répertoire de stockage
export const initStorage = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CARD_DECKS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CARD_DECKS_DIR, { intermediates: true });
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du stockage:', error);
  }
};

// Charger la configuration des jeux de cartes
export const loadCardDecksConfig = async (): Promise<CardDecksConfig> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la configuration:', error);
  }

  // Configuration par défaut
  return {
    decks: [{
      id: 'default',
      name: 'Jeu standard',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      images: [],
      isDefault: true,
    }],
    activeDeckId: 'default',
  };
};

// Sauvegarder la configuration
export const saveCardDecksConfig = async (config: CardDecksConfig): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(config);
    console.log('Sauvegarde config:', jsonValue.substring(0, 100) + '...');
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('Config sauvegardée avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la configuration:', error);
    throw error;
  }
};

// Créer un nouveau jeu de cartes
export const createCardDeck = async (name: string): Promise<CardDeck> => {
  const config = await loadCardDecksConfig();
  
  const newDeck: CardDeck = {
    id: `deck_${Date.now()}`,
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    images: [],
  };

  config.decks.push(newDeck);
  await saveCardDecksConfig(config);

  // Créer le dossier pour ce jeu
  const deckDir = `${CARD_DECKS_DIR}${newDeck.id}/`;
  await FileSystem.makeDirectoryAsync(deckDir, { intermediates: true });

  return newDeck;
};

// Supprimer un jeu de cartes
export const deleteCardDeck = async (deckId: string): Promise<void> => {
  try {
    console.log('Début suppression du jeu:', deckId);
    const config = await loadCardDecksConfig();
    console.log('Configuration chargée:', config);
    
    // Ne pas supprimer le jeu par défaut
    const deck = config.decks.find(d => d.id === deckId);
    if (deck?.isDefault) {
      throw new Error('Impossible de supprimer le jeu par défaut');
    }

    if (!deck) {
      throw new Error('Jeu de cartes introuvable');
    }

    // Supprimer le dossier du jeu (avec gestion d'erreur)
    try {
      const deckDir = `${CARD_DECKS_DIR}${deckId}/`;
      console.log('Tentative suppression dossier:', deckDir);
      const dirInfo = await FileSystem.getInfoAsync(deckDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(deckDir, { idempotent: true });
        console.log('Dossier supprimé');
      } else {
        console.log('Dossier n\'existe pas');
      }
    } catch (fsError) {
      console.warn('Erreur lors de la suppression du dossier:', fsError);
      // On continue quand même pour supprimer la config
    }

    // Mettre à jour la configuration
    config.decks = config.decks.filter(d => d.id !== deckId);
    console.log('Nombre de jeux après filtrage:', config.decks.length);
    
    // Si le jeu supprimé était actif, revenir au jeu par défaut
    if (config.activeDeckId === deckId) {
      config.activeDeckId = 'default';
      console.log('Jeu actif remis à default');
    }

    await saveCardDecksConfig(config);
    console.log('Configuration sauvegardée');
  } catch (error) {
    console.error('Erreur dans deleteCardDeck:', error);
    throw error;
  }
};

// Ajouter une image à un jeu de cartes
export const addCardImage = async (
  deckId: string,
  imageUri: string,
  value: CardValue,
  suit?: CardSuit
): Promise<CardImage> => {
  const config = await loadCardDecksConfig();
  const deck = config.decks.find(d => d.id === deckId);
  
  if (!deck) {
    throw new Error('Jeu de cartes introuvable');
  }

  // Copier l'image dans le dossier du jeu
  const imageId = `img_${Date.now()}`;
  const extension = imageUri.split('.').pop() || 'jpg';
  const newPath = `${CARD_DECKS_DIR}${deckId}/${imageId}.${extension}`;
  
  await FileSystem.copyAsync({
    from: imageUri,
    to: newPath,
  });

  const cardImage: CardImage = {
    id: imageId,
    uri: newPath,
    value,
    ...(suit && { suit }), // Ajouter suit seulement si défini
  };

  deck.images.push(cardImage);
  deck.updatedAt = Date.now();
  
  await saveCardDecksConfig(config);

  return cardImage;
};

// Supprimer une image d'un jeu de cartes
export const deleteCardImage = async (deckId: string, imageId: string): Promise<void> => {
  const config = await loadCardDecksConfig();
  const deck = config.decks.find(d => d.id === deckId);
  
  if (!deck) {
    throw new Error('Jeu de cartes introuvable');
  }

  const image = deck.images.find(img => img.id === imageId);
  if (image) {
    // Supprimer le fichier
    const fileInfo = await FileSystem.getInfoAsync(image.uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(image.uri, { idempotent: true });
    }

    // Retirer de la liste
    deck.images = deck.images.filter(img => img.id !== imageId);
    deck.updatedAt = Date.now();
    
    await saveCardDecksConfig(config);
  }
};

// Définir le jeu de cartes actif
export const setActiveDeck = async (deckId: string): Promise<void> => {
  const config = await loadCardDecksConfig();
  
  if (!config.decks.find(d => d.id === deckId)) {
    throw new Error('Jeu de cartes introuvable');
  }

  config.activeDeckId = deckId;
  await saveCardDecksConfig(config);
};

// Obtenir le jeu de cartes actif
export const getActiveDeck = async (): Promise<CardDeck | null> => {
  const config = await loadCardDecksConfig();
  
  if (!config.activeDeckId) {
    return null;
  }

  return config.decks.find(d => d.id === config.activeDeckId) || null;
};

// Obtenir une image pour une carte spécifique
export const getCardImage = async (value: CardValue, suit: CardSuit): Promise<string | null> => {
  const activeDeck = await getActiveDeck();
  
  if (!activeDeck || activeDeck.isDefault) {
    return null;
  }

  // Chercher une image correspondante (d'abord avec couleur exacte, puis sans couleur)
  let images = activeDeck.images.filter(img => img.value === value && img.suit === suit);
  
  // Si aucune image avec la couleur exacte, chercher une image sans couleur spécifique
  if (images.length === 0) {
    images = activeDeck.images.filter(img => img.value === value && !img.suit);
  }
  
  if (images.length === 0) {
    return null;
  }

  // Retourner une image aléatoire parmi celles disponibles
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex].uri;
};

// Mettre à jour le nom d'un jeu de cartes
export const updateCardDeckName = async (deckId: string, newName: string): Promise<void> => {
  const config = await loadCardDecksConfig();
  const deck = config.decks.find(d => d.id === deckId);
  
  if (!deck) {
    throw new Error('Jeu de cartes introuvable');
  }

  if (deck.isDefault) {
    throw new Error('Impossible de modifier le jeu par défaut');
  }

  deck.name = newName;
  deck.updatedAt = Date.now();
  
  await saveCardDecksConfig(config);
};
