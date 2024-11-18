import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Button, View, Text } from 'react-native';
import BarbuGame from '../components/Games/Barbu/barbuGame'; // Import du jeu Barbu

const App = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelect = (game: string) => {
    setSelectedGame(game);
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedGame === null ? (
        <View style={styles.gameSelection}>
          <Text style={styles.title}>Choisissez un jeu</Text>
          <Button title="Barbu" onPress={() => handleGameSelect('barbu')} />
          {/* Ajouter d'autres jeux ici */}
        </View>
      ) : selectedGame === 'barbu' ? (
        <BarbuGame />
      ) : (
        <Text>Jeu non disponible</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  gameSelection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
