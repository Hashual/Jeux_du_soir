// components/cardGame.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import deckData from '../assets/data/deck.json'; // Assure-toi que le chemin est correct

// Définir la structure d'une carte
export interface Card {
  suit: string;
  value: string;
}

// Fonction pour générer un deck à partir du JSON
export const generateDeck = (): Card[] => {
  if (deckData?.deck) {
    return deckData.deck;
  } else {
    throw new Error('Erreur dans la génération du deck.'); 
  }
};

// Fonction pour mélanger les cartes avec l'algorithme de Fisher-Yates
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Composant du jeu de cartes
const CardGame: React.FC<{ numberOfCards: number }> = ({ numberOfCards }) => {
  const [deck, setDeck] = useState<Card[]>([]); // Deck initial
  const [shuffledDeck, setShuffledDeck] = useState<Card[]>([]); // Deck mélangé
  const [currentCard, setCurrentCard] = useState<string>(''); // Carte actuelle à afficher
  const [remainingCards, setRemainingCards] = useState<number>(0); // Nombre de cartes restantes

  // Charger le JSON dans le state au démarrage et mélanger les cartes
  useEffect(() => {
    try {
      const initialDeck = generateDeck(); // Utilise generateDeck
      const shuffledDeck = shuffleDeck(initialDeck);  // Mélange les cartes initiales
      setDeck(initialDeck); // Met à jour le deck initial
      setShuffledDeck(shuffledDeck); // Mettre à jour le deck mélangé
      setRemainingCards(shuffledDeck.length); // Initialiser le nombre de cartes restantes
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les cartes.');
    }
  }, []);

  // Fonction pour gérer le tirage d'une carte
  const handleCardClick = () => {
    if (shuffledDeck.length > 0) {
      const nextCard = shuffledDeck[0]; // Prendre la première carte du paquet
      setCurrentCard(`${nextCard.value} de ${nextCard.suit}`); // Afficher la carte
      setShuffledDeck(shuffledDeck.slice(1)); // Enlever la carte du paquet
      setRemainingCards(shuffledDeck.length - 1); // Mettre à jour le nombre de cartes restantes
    } else {
      Alert.alert('Fin du jeu', 'Aucune carte restante dans le paquet.');
    }
  };

  // Fonction de gestion du bouton pour mélanger à nouveau
  const handleShuffle = () => {
    setShuffledDeck(shuffleDeck(deck));  // Mélange le deck chaque fois que le bouton est cliqué
    setRemainingCards(deck.length); // Réinitialiser le nombre de cartes restantes
    setCurrentCard(''); // Réinitialiser la carte actuelle
  };

  return (
    <View style={styles.container}>
      <Button title="Mélanger les cartes" onPress={handleShuffle} />
      
      {/* Affichage de la carte actuelle */}
      {currentCard && (
        <View style={styles.card}>
          <Text style={styles.text}>{currentCard}</Text>
        </View>
      )}
      
      {/* Affichage du nombre de cartes restantes */}
      <Text style={styles.counter}>Cartes restantes : {remainingCards}</Text>
      
      {/* Affichage de la carte de dos */}
      <Button title="Tirer une carte" onPress={handleCardClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  card: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  counter: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default CardGame;
