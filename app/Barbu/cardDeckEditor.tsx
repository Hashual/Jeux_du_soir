import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CardDeck, CardValue } from '@/types/cardDeck.types';
import {
  loadCardDecksConfig,
  addCardImage,
  deleteCardImage,
} from '@/services/cardDeckStorage';
import { ThemedButton } from '@/components/utilities/themedButton';

const CARD_VALUES: CardValue[] = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valet', 'Reine', 'Roi'];

const CardDeckEditor: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const deckId = params.deckId as string;

  const [deck, setDeck] = useState<CardDeck | null>(null);
  const [selectedValue, setSelectedValue] = useState<CardValue>('Roi');

  const loadDeck = useCallback(async () => {
    try {
      const config = await loadCardDecksConfig();
      const foundDeck = config.decks.find(d => d.id === deckId);
      if (foundDeck) {
        setDeck(foundDeck);
      } else {
        Alert.alert('Erreur', 'Jeu de cartes introuvable');
        router.back();
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger le jeu de cartes');
    }
  }, [deckId, router]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission requise',
            'L\'accès à la galerie est nécessaire pour ajouter des images'
          );
        }
      }
    })();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Image sélectionnée:', result.assets[0].uri);
        await addCardImage(deckId, result.assets[0].uri, selectedValue);
        await loadDeck();
        Alert.alert('Succès', 'Image ajoutée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image:', error);
      Alert.alert('Erreur', `Impossible d'ajouter l'image: ${error}`);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer cette image ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCardImage(deckId, imageId);
              await loadDeck();
              Alert.alert('Succès', 'Image supprimée');
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', `Impossible de supprimer l'image: ${error}`);
            }
          },
        },
      ]
    );
  };

  const getImagesForSelectedCard = () => {
    if (!deck) return [];
    return deck.images.filter(
      img => img.value === selectedValue
    );
  };

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const images = getImagesForSelectedCard();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedButton
          title="Retour"
          icon="arrow-left"
          onPress={() => router.back()}
          padH={15}
          padV={8}
        />
        <Text style={styles.title}>{deck.name}</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Sélection de la valeur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valeur de la carte</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsRow}>
              {CARD_VALUES.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.optionButton,
                    selectedValue === value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedValue(value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === value && styles.optionTextSelected,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Carte sélectionnée */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Carte sélectionnée: {selectedValue}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Les images ajoutées seront utilisées pour toutes les couleurs de cette valeur
          </Text>
        </View>

        {/* Bouton d'ajout */}
        <View style={styles.section}>
          <ThemedButton
            title="Ajouter une image depuis la galerie"
            icon="image-plus"
            color="#3498db"
            textColor="#fff"
            onPress={handlePickImage}
            padH={20}
            padV={12}
          />
        </View>

        {/* Liste des images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Images pour cette carte ({images.length})
          </Text>
          {images.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="image-off" size={48} color="#95a5a6" />
              <Text style={styles.emptyText}>Aucune image pour cette carte</Text>
            </View>
          ) : (
            <View style={styles.imagesGrid}>
              {images.map((img) => (
                <View key={img.id} style={styles.imageItem}>
                  <Image source={{ uri: img.uri }} style={styles.cardImage} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteImage(img.id)}
                  >
                    <MaterialCommunityIcons name="delete" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    borderWidth: 2,
    borderColor: '#bdc3c7',
  },
  optionButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  optionTextSelected: {
    color: '#fff',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  imageItem: {
    width: 90,
    height: 135,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#e74c3c',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default CardDeckEditor;
