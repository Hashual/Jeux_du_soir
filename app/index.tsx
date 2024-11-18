// App.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BarbuGame from '../components/Games/Barbu/barbuGame'; // Importer ton jeu Barbu

const App: React.FC = () => {

 

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Menu Principal</Text> */}
      <BarbuGame/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  gameContainer: {
    alignItems: 'center',
  },
  menuContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
