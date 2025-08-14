import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { generateDeck, shuffleDeck } from '../../components/cardGame';
import BackCard from '../../components/backCard';
import { useRouter } from 'expo-router';
import { ThemedButton } from '@/components/utilities/themedButton';

const BarbuGame: React.FC = () => {
  const router = useRouter();

  const [deck, setDeck] = useState<any[]>([]);
  const [isCardFaceUp, setIsCardFaceUp] = useState<boolean>(false);
  const [remainingCards, setRemainingCards] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<string>('');
  const [isRulesVisible, setIsRulesVisible] = useState<boolean>(false); // État pour le modal

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

  const rules = [
    { title: "Cartes rouges (AS à 6)", description: "Donne le nombre de gorgées correspondant à la carte (AS = cul sec)." },
    { title: "Cartes noires (AS à 6)", description: "Prends pour toi le nombre de gorgées correspondant à la carte (AS = cul sec)." },
    { title: "7", description: "Gorgée du peuple : tout le monde prend une gorgée." },
    { title: "8", description: "J'ai jamais : dites quelque chose que vous n'avez jamais fait. Tous ceux qui l'ont fait boivent 1x." },
    { title: "9", description: "J'ai déjà : même principe que le 8, mais en affirmant avoir déjà fait quelque chose." },
    { title: "10", description: "Dans ma valise : chacun répète la liste précédente et ajoute un mot. Le premier qui se trompe boit." },
    { title: "Valet", description: "Roi des pouces : peut poser son pouce ou son menton. Le dernier à imiter boit. Change au prochain valet." },
    { title: "Reine", description: "Reine des putes : si un joueur croise son regard et qu’elle dit 'tu bois', il boit. Change à la prochaine reine." },
    { title: "Roi", description: "Invente ou annule une règle de votre choix." }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <ThemedButton title="Retour au menu" onPress={() => router.push('/')} icon="home" />
        <ThemedButton title="Règles" onPress={() => setIsRulesVisible(true)} icon="book" />
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

      {/* Modal pour les règles */}
      <Modal visible={isRulesVisible} animationType="slide">
        <View style={styles.rulesContainer}>
          <Text style={styles.rulesHeader}>Règles du Barbu</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {rules.map((rule, index) => (
              <View key={index} style={styles.ruleCard}>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
                <Text style={styles.ruleDescription}>{rule.description}</Text>
              </View>
            ))}
          </ScrollView>
          <ThemedButton title="Fermer" onPress={() => setIsRulesVisible(false)} icon="close" color='1b1b1b' text_position='center' textColor="#fff"/>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  gameContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  counter: { fontSize: 18, marginTop: 20 },
  card: { width: 100, height: 150, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 5, backgroundColor: '#FFF', marginTop: 10 },
  cardText: { fontSize: 16, fontWeight: 'bold' },
  menuContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  
  // Styles du modal
  rulesContainer: { flex: 1, backgroundColor: '#1b1b1b', paddingTop: 50, paddingHorizontal: 16 },
  rulesHeader: { fontSize: 28, fontWeight: 'bold', color: '#f1c40f', textAlign: 'center', marginBottom: 20 },
  scrollContent: { paddingBottom: 30 },
  ruleCard: { backgroundColor: '#2c2c2c', padding: 15, borderRadius: 12, marginBottom: 12 },
  ruleTitle: { fontSize: 20, fontWeight: 'bold', color: '#f39c12', marginBottom: 6 },
  ruleDescription: { fontSize: 16, color: '#ecf0f1' }
});

export default BarbuGame;
