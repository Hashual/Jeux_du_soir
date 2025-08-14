import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BackCardProps {
  isFaceUp: boolean; 
  onPress: () => void;
}

const BackCard: React.FC<BackCardProps> = ({ isFaceUp, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={[styles.cardContent, isFaceUp && styles.faceUp]}>
        <Text style={styles.cardText}>Pioche</Text> 
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  cardContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  faceUp: {
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BackCard;
