
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const suitIcons = {
  '♥': { name: 'cards-heart', color: '#e74c3c' },
  '♦': { name: 'cards-diamond', color: '#e74c3c' },
  '♣': { name: 'cards-club', color: '#34495e' },
  '♠': { name: 'cards-spade', color: '#34495e' },
};

export type CardProps = {
  value: string;
  suit: '♥' | '♦' | '♣' | '♠';
  isFaceUp?: boolean;
  onPress?: () => void;
  style?: any;
  customImageUri?: string | null; // URI de l'image personnalisée
};

const Card: React.FC<CardProps> = ({ value, suit, isFaceUp = true, onPress, style, customImageUri }) => {
  const icon = suitIcons[suit];
  const iconName = icon.name as keyof typeof MaterialCommunityIcons.glyphMap;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={!onPress} style={[styles.touchable, style]}>
      <View style={[styles.card, !isFaceUp && styles.cardBack]}>
        {isFaceUp ? (
          <>
            {customImageUri ? (
              // Afficher l'image personnalisée
              <Image source={{ uri: customImageUri }} style={styles.customImage} resizeMode="cover" />
            ) : (
              // Afficher la carte standard avec icônes
              <>
                <View style={styles.cornerTopLeft}>
                  <Text style={[styles.value, { color: icon.color }]}>{value}</Text>
                  <MaterialCommunityIcons name={iconName} size={18} color={icon.color} />
                </View>
                <View style={styles.centerIcon}>
                  <MaterialCommunityIcons name={iconName} size={40} color={icon.color} />
                </View>
                <View style={styles.cornerBottomRight}>
                  <Text style={[styles.value, { color: icon.color }]}>{value}</Text>
                  <MaterialCommunityIcons name={iconName} size={18} color={icon.color} />
                </View>
              </>
            )}
          </>
        ) : (
          <View style={styles.backContent}>
            <MaterialCommunityIcons name={"cards" as keyof typeof MaterialCommunityIcons.glyphMap} size={40} color="#888" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: 110,
    height: 165,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#bbb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  cardBack: {
    backgroundColor: '#1b1b1b',
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 4,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 2,
  },
  customImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});

export default Card;
