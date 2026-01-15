import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CardDeck } from '@/types/cardDeck.types';
import {
  loadCardDecksConfig,
  createCardDeck,
  deleteCardDeck,
  setActiveDeck,
  updateCardDeckName,
  initStorage,
} from '@/services/cardDeckStorage';
import { ThemedButton } from '@/components/utilities/themedButton';

const CardDeckManager: React.FC = () => {
  const router = useRouter();
  const [decks, setDecks] = useState<CardDeck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [editingDeck, setEditingDeck] = useState<CardDeck | null>(null);
  const [editDeckName, setEditDeckName] = useState('');

  const loadDecks = useCallback(async () => {
    try {
      await initStorage();
      const config = await loadCardDecksConfig();
      setDecks(config.decks);
      setActiveDeckId(config.activeDeckId);
    } catch (error) {
      console.error('Erreur lors du chargement des jeux:', error);
      Alert.alert('Erreur', 'Impossible de charger les jeux de cartes');
    }
  }, []);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour le jeu');
      return;
    }

    try {
      const newDeck = await createCardDeck(newDeckName.trim());
      setNewDeckName('');
      setIsCreateModalVisible(false);
      
      // Recharger complètement la liste
      await loadDecks();
      
      Alert.alert('Succès', 'Jeu de cartes créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      Alert.alert('Erreur', 'Impossible de créer le jeu de cartes');
    }
  };

  const handleDeleteDeck = (deck: CardDeck) => {
    if (deck.isDefault) {
      Alert.alert('Erreur', 'Impossible de supprimer le jeu par défaut');
      return;
    }

    console.log('Demande de suppression du jeu:', deck.id, deck.name);

    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le jeu "${deck.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Suppression confirmée, appel deleteCardDeck...');
              await deleteCardDeck(deck.id);
              console.log('deleteCardDeck terminé, rechargement complet...');
              
              // Recharger complètement la liste
              await loadDecks();
              console.log('Liste rechargée avec succès');
              
              Alert.alert('Succès', 'Jeu de cartes supprimé');
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', `Impossible de supprimer le jeu de cartes: ${error}`);
            }
          },
        },
      ]
    );
  };

  const handleSetActiveDeck = async (deckId: string) => {
    try {
      await setActiveDeck(deckId);
      await loadDecks();
      Alert.alert('Succès', 'Jeu de cartes actif modifié');
    } catch (error) {
      console.error('Erreur lors du changement:', error);
      Alert.alert('Erreur', 'Impossible de changer le jeu actif');
    }
  };

  const handleEditDeck = (deck: CardDeck) => {
    if (deck.isDefault) {
      Alert.alert('Erreur', 'Impossible de modifier le jeu par défaut');
      return;
    }
    setEditingDeck(deck);
    setEditDeckName(deck.name);
    setIsEditModalVisible(true);
  };

  const handleUpdateDeckName = async () => {
    if (!editDeckName.trim() || !editingDeck) {
      Alert.alert('Erreur', 'Veuillez entrer un nom valide');
      return;
    }

    try {
      await updateCardDeckName(editingDeck.id, editDeckName.trim());
      setIsEditModalVisible(false);
      setEditingDeck(null);
      setEditDeckName('');
      
      // Recharger complètement la liste
      await loadDecks();
      
      Alert.alert('Succès', 'Nom du jeu modifié');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      Alert.alert('Erreur', 'Impossible de modifier le nom');
    }
  };

  const handleEditImages = (deck: CardDeck) => {
    router.push({
      pathname: '/Barbu/cardDeckEditor',
      params: { deckId: deck.id },
    });
  };

  const renderDeckItem = ({ item }: { item: CardDeck }) => {
    const isActive = item.id === activeDeckId;

    return (
      <View style={[styles.deckItem, isActive && styles.activeDeckItem]}>
        <View style={styles.deckInfo}>
          <View style={styles.deckHeader}>
            <Text style={styles.deckName}>{item.name}</Text>
            {isActive && (
              <MaterialCommunityIcons name="check-circle" size={24} color="#27ae60" />
            )}
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Défaut</Text>
              </View>
            )}
          </View>
          <Text style={styles.deckDetails}>
            {item.images.length} image(s) • Créé le {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.deckActions}>
          {!isActive && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetActiveDeck(item.id)}
            >
              <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={24} color="#3498db" />
            </TouchableOpacity>
          )}

          {!item.isDefault && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditDeck(item)}
              >
                <MaterialCommunityIcons name="pencil" size={24} color="#f39c12" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteDeck(item)}
              >
                <MaterialCommunityIcons name="delete" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditImages(item)}
          >
            <MaterialCommunityIcons name="image-multiple" size={24} color="#9b59b6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <Text style={styles.title}>Gestion des jeux de cartes</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <ThemedButton
            title=""
            icon="refresh"
            color="#3498db"
            textColor="#fff"
            onPress={() => {
              console.log('Rafraîchissement manuel...');
              loadDecks();
            }}
            padH={10}
            padV={8}
          />
          <ThemedButton
            title="Nouveau"
            icon="plus"
            color="#27ae60"
            textColor="#fff"
            onPress={() => setIsCreateModalVisible(true)}
            padH={15}
            padV={8}
          />
        </View>
      </View>

      <FlatList
        data={decks}
        renderItem={renderDeckItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cards-outline" size={64} color="#95a5a6" />
            <Text style={styles.emptyText}>Aucun jeu de cartes</Text>
          </View>
        }
      />

      {/* Modal de création */}
      <Modal
        visible={isCreateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau jeu de cartes</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du jeu"
              value={newDeckName}
              onChangeText={setNewDeckName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <ThemedButton
                title="Annuler"
                onPress={() => {
                  setIsCreateModalVisible(false);
                  setNewDeckName('');
                }}
                color="#95a5a6"
                textColor="#fff"
                padH={20}
                padV={10}
              />
              <ThemedButton
                title="Créer"
                onPress={handleCreateDeck}
                color="#27ae60"
                textColor="#fff"
                padH={20}
                padV={10}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal d'édition */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du jeu"
              value={editDeckName}
              onChangeText={setEditDeckName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <ThemedButton
                title="Annuler"
                onPress={() => {
                  setIsEditModalVisible(false);
                  setEditingDeck(null);
                  setEditDeckName('');
                }}
                color="#95a5a6"
                textColor="#fff"
                padH={20}
                padV={10}
              />
              <ThemedButton
                title="Enregistrer"
                onPress={handleUpdateDeckName}
                color="#27ae60"
                textColor="#fff"
                padH={20}
                padV={10}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    minWidth: 150,
  },
  listContainer: {
    padding: 12,
  },
  deckItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeDeckItem: {
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  deckInfo: {
    flex: 1,
    marginRight: 8,
  },
  deckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  deckName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  deckDetails: {
    fontSize: 11,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  defaultBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  deckActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 14,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default CardDeckManager;
