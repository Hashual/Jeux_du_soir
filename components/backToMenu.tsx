// components/BackToMenu.tsx
import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

interface BackToMenuProps {
  onBackToMenu: () => void; // Fonction passée en prop pour gérer le retour au menu
}

const BackToMenu: React.FC<BackToMenuProps> = ({ onBackToMenu }) => {
  
  // Fonction pour afficher la fenêtre de confirmation avant de revenir au menu
  const handleBackToMenu = () => {
    Alert.alert(
      "Retour au Menu",
      "Êtes-vous sûr de vouloir retourner au menu ? Vous perdrez votre progression.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Oui",
          onPress: onBackToMenu, // Appeler la fonction de retour au menu si l'utilisateur confirme
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retour au Menu</Text>
      <Button title="Retour au Menu" onPress={handleBackToMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default BackToMenu;
