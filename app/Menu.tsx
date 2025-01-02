// Index.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedButton } from '@/components/utilities/themedButton';


const App: React.FC = () => { 
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Principal</Text>
      <ThemedButton title="Jouer au Barbu" onPress={() => router.push('/Barbu/barbuGame')} icon='cards' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    height: '100%',
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
});

export default App;
