import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { generateDeck, shuffleDeck } from '../../components/cardGame';
import BackCard from '../../components/backCard';
import Card from '../../components/card';
import { useRouter } from 'expo-router';
import { ThemedButton } from '@/components/utilities/themedButton';
import { getCardImage, initStorage } from '@/services/cardDeckStorage';
import { CardValue, CardSuit } from '@/types/cardDeck.types';

const BarbuGame: React.FC = () => {
  const [isShuffleConfirmVisible, setIsShuffleConfirmVisible] = useState(false);
  // Mapping des noms français vers caractères
  const suitMap: Record<string, '♥' | '♦' | '♣' | '♠'> = {
    'Coeur': '♥',
    'Carreau': '♦',
    'Trèfles': '♣',
    'Pique': '♠',
    'Piques': '♠',
    'Trèfle': '♣',
  };
  const router = useRouter();

  const [deck, setDeck] = useState<any[]>([]);
  const [isCardFaceUp, setIsCardFaceUp] = useState<boolean>(false);
  const [remainingCards, setRemainingCards] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<string>('');
const [currentCardObj, setCurrentCardObj] = useState<any | null>(null);
  const [isRulesVisible, setIsRulesVisible] = useState<boolean>(false); // État pour le modal
  const [currentCardImageUri, setCurrentCardImageUri] = useState<string | null>(null);

  useEffect(() => {
    // Initialiser le stockage au démarrage
    initStorage();
    
    const initialDeck = generateDeck();
    const shuffledDeck = shuffleDeck(initialDeck);
    setDeck(shuffledDeck);
    setRemainingCards(shuffledDeck.length);
  }, []);

  const handleShuffle = () => {
    const initialDeck = generateDeck();
    const shuffledDeck = shuffleDeck(initialDeck);
    setDeck(shuffledDeck);
    setRemainingCards(shuffledDeck.length);
    setCurrentCardObj(null);
    setCurrentCardImageUri(null);
    setIsCardFaceUp(false);
    setIsShuffleConfirmVisible(false);
  };

  const handleCardClick = async () => {
    if (deck.length > 0) {
      const nextCard = deck[0];
      setCurrentCard(`${nextCard.value} de ${nextCard.suit}`);
      setCurrentCardObj(nextCard);
      setDeck(deck.slice(1));
      setRemainingCards(deck.length - 1);
      setIsCardFaceUp(true);
      
      // Récupérer l'image personnalisée pour cette carte
      try {
        // Convertir le nom français en CardSuit
        let suitName = nextCard.suit;
        // Normaliser les variations de nom
        if (suitName === 'Piques') suitName = 'Pique';
        if (suitName === 'Trèfle') suitName = 'Trèfles';
        
        const imageUri = await getCardImage(nextCard.value as CardValue, suitName as CardSuit);
        console.log('Image trouvée pour', nextCard.value, suitName, ':', imageUri);
        setCurrentCardImageUri(imageUri);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
        setCurrentCardImageUri(null);
      }
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
        <ThemedButton padH={20} padV={7} textStyle={{ fontSize: 16 }} title="Menu" onPress={() => router.push('/')} icon="home" />
        <ThemedButton padH={20} padV={7} textStyle={{ fontSize: 16 }} title="Règles" onPress={() => setIsRulesVisible(true)} icon="book" />
        <ThemedButton padH={20} padV={7} textStyle={{ fontSize: 16 }} title="Jeux de cartes" onPress={() => router.push('/Barbu/cardDeckManager')} icon="cards" />
      </View>

      <View style={styles.gameContainerRow}>
        <View style={styles.gameContainerCol}>
          <Text style={styles.title}>Jeu du Barbu</Text>
          <BackCard onPress={handleCardClick} isFaceUp={isCardFaceUp} />
          {isCardFaceUp && currentCardObj && (
            <Card
              value={currentCardObj.value}
              suit={suitMap[currentCardObj.suit] || '♠'}
              isFaceUp={true}
              customImageUri={currentCardImageUri}
            />
          )}
          <Text style={styles.counter}>Cartes restantes : {remainingCards}</Text>
        </View>
        <View style={styles.shuffleContainer}>
          <ThemedButton
            title="Mélanger"
            icon="shuffle"
            color="#f39c12"
            textColor="#fff"
            text_position="center"
            onPress={() => setIsShuffleConfirmVisible(true)}
          />
        </View>
      </View>
      {/* Modal de confirmation pour le mélange */}
      <Modal visible={isShuffleConfirmVisible} transparent animationType="fade">
        <View style={styles.confirmModalBg}>
          <View style={styles.confirmModalBox}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center'}}>Voulez-vous vraiment mélanger le jeu ?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <ThemedButton title="Annuler" padH={20} onPress={() => setIsShuffleConfirmVisible(false)} color="#888" textColor="#fff" text_position="center" />
              <ThemedButton title="Oui" padH={20} onPress={handleShuffle} color="#27ae60" textColor="#fff" text_position="center" />
            </View>
          </View>
        </View>
      </Modal>

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
  gameContainerRow: { flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  gameContainerCol: { alignItems: 'center', justifyContent: 'center' },
  shuffleContainer: { justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 10 },
  confirmModalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  confirmModalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 5, width: '90%', maxWidth: 400 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  counter: { fontSize: 16, marginVertical: 12, textAlign: 'center', color: '#2c3e50' },
  cardText: { fontSize: 16, fontWeight: 'bold' },
  menuContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingHorizontal: 10, flexWrap: 'wrap', gap: 8 },
  
  // Styles du modal
  rulesContainer: { flex: 1, backgroundColor: '#1b1b1b', paddingTop: 40, paddingHorizontal: 16 },
  rulesHeader: { fontSize: 24, fontWeight: 'bold', color: '#f1c40f', textAlign: 'center', marginBottom: 16 },
  scrollContent: { paddingBottom: 30 },
  ruleCard: { backgroundColor: '#2c2c2c', padding: 12, borderRadius: 10, marginBottom: 10 },
  ruleTitle: { fontSize: 18, fontWeight: 'bold', color: '#f39c12', marginBottom: 5 },
  ruleDescription: { fontSize: 14, color: '#ecf0f1', lineHeight: 20 }
});

export default BarbuGame;
