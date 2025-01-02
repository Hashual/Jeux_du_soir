import { View, StyleSheet } from 'react-native';
import React from 'react';
import Menu from './Menu';

const App: React.FC = () => { 

  return (
    <View style={styles.container}>
      <Menu/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
});

export default App;
