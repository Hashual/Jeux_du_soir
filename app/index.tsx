import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CardGame from '../components/cardGame'; // Assure-toi que le chemin est correct

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CardGame /> {/* Appel du composant CardGame pour afficher les cartes */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Arrière-plan neutre
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default App;
