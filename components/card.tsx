import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ value, suit }: { value: string; suit: string }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{value} de {suit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
});

export default Card;
