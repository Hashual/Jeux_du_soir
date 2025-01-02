import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { generateDeck, shuffleDeck } from '../../components/cardGame'; // Import du CardGame
import BackCard from '../../components/backCard'; // Import du composant BackCard
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import { ThemedButton } from '@/components/utilities/themedButton';


const BarbuGame: React.FC = () => {

  const router = useRouter();

  const [deck, setDeck] = useState<any[]>([]);
  const [isCardFaceUp, setIsCardFaceUp] = useState<boolean>(false);
  const [remainingCards, setRemainingCards] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<string>('');

  useEffect(() => {
    const initialDeck = generateDeck();
    const shuffledDeck = shuffleDeck(initialDeck);
    setDeck(shuffledDeck);
    setRemainingCards(shuffledDeck.length);
  }, []);

  const handleCardClick = () => {
    if (deck.length > 0) {
      const nextCard = deck[0]; 
      setCurrentCard(`${nextCard.value} de ${nextCard.suit}`); 
      setDeck(deck.slice(1)); 
      setRemainingCards(deck.length - 1);
      setIsCardFaceUp(true); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <ThemedButton title="Retour au menu" onPress={() => router.push('/')} icon="home" />
        {/* <ThemedButton title="Règles" onPress={() => router.push('/')} icon="book"/> */}
      </View>
      <View style={styles.gameContainer}>
      <Text style={styles.title}>Jeu du Barbu</Text>
      
      <BackCard onPress={handleCardClick} isFaceUp={isCardFaceUp} />
      
      {isCardFaceUp && (
        <View style={styles.card}>
          <Text style={styles.cardText}>{currentCard}</Text>
        </View>
      )}
      
      <Text style={styles.counter}>Cartes restantes : {remainingCards}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  gameContainer:{
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
  menuContainer:{
    backgroundColor: '#f0f0f0',
    width: '100%',
    marginTop:0,
    marginLeft:0,
  }
});

export default BarbuGame;
