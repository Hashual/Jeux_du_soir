// games/barbu/BarbuGame.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { generateDeck, shuffleDeck, Card } from '../../cardGame'; // Import du CardGame
import BackCard from '../../backCard'; // Import du composant BackCard

const BarbuGame: React.FC = () => {
  const [deck, setDeck] = useState<any[]>([]); // Deck de cartes (au format json)
  const [isCardFaceUp, setIsCardFaceUp] = useState<boolean>(false); // Si la carte est face visible ou non
  const [remainingCards, setRemainingCards] = useState<number>(0); // Nombre de cartes restantes
  const [currentCard, setCurrentCard] = useState<string>(''); // Contenu de la carte actuelle

  // Initialiser le deck et le mélanger
  useEffect(() => {
    const initialDeck = generateDeck(); // Appel à generateDeck pour créer le paquet
    const shuffledDeck = shuffleDeck(initialDeck); // Mélanger le paquet
    setDeck(shuffledDeck);
    setRemainingCards(shuffledDeck.length); // Initialiser le nombre de cartes restantes
  }, []);

  // Fonction pour gérer le clic sur la carte de dos
  const handleCardClick = () => {
    if (deck.length > 0) {
      const nextCard = deck[0]; // Prendre la première carte du paquet
      setCurrentCard(`${nextCard.value} de ${nextCard.suit}`); // Afficher la carte
      setDeck(deck.slice(1)); // Enlever la carte du paquet
      setRemainingCards(deck.length - 1); // Mettre à jour le nombre de cartes restantes
      setIsCardFaceUp(true); // Retourner la carte pour l'afficher
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jeu de Barbu</Text>
      
      {/* Affichage de la carte de dos */}
      <BackCard onPress={handleCardClick} isFaceUp={isCardFaceUp} />
      
      {/* Affichage de la carte visible si elle est face visible */}
      {isCardFaceUp && (
        <View style={styles.card}>
          <Text style={styles.cardText}>{currentCard}</Text>
        </View>
      )}
      
      {/* Affichage du nombre de cartes restantes */}
      <Text style={styles.counter}>Cartes restantes : {remainingCards}</Text>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  counter: {
    fontSize: 18,
    marginTop: 20,
  },
  card: {
    width: 100,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarbuGame;
