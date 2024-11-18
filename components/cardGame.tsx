import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

// Importation du JSON depuis le dossier 'assets/data'
import deckData from '../assets/data/deck.json'; // Assure-toi que le chemin est correct

const CardGame = () => {
  const [deck, setDeck] = useState<any[]>([]);

  // Charger le JSON dans le state au démarrage
  useEffect(() => {
    if (deckData?.deck) {
      setDeck(deckData.deck);  // Met à jour le state avec le JSON
    } else {
      Alert.alert('Erreur', 'Impossible de charger les cartes.');
    }
  }, []);

  return (
    <View style={styles.container}>
      {deck.map((card, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.text}>{`${card.value} de ${card.suit}`}</Text>
        </View>
      ))}
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
});

export default CardGame;
