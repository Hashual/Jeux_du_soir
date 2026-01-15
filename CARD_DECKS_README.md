# Système de gestion de jeux de cartes personnalisés

## 📋 Vue d'ensemble

Ce système permet de créer et gérer plusieurs jeux de cartes avec des images personnalisées. Vous pouvez associer des photos à chaque carte (Roi, Reine, Valet, etc.) et choisir quel jeu de cartes utiliser dans le jeu du Barbu.

## 🎯 Fonctionnalités

### Gestion des jeux de cartes
- ✅ Créer un nouveau jeu de cartes personnalisé
- ✅ Renommer un jeu de cartes
- ✅ Supprimer un jeu de cartes
- ✅ Sélectionner le jeu actif
- ✅ Jeu par défaut avec icônes standard

### Gestion des images
- ✅ Ajouter des images depuis la galerie
- ✅ Plusieurs images par carte
- ✅ Supprimer des images
- ✅ Images pour toutes les cartes (As à Roi, toutes couleurs)
- ✅ Sélection aléatoire quand plusieurs images disponibles

## 📁 Structure des fichiers

```
Jeux_du_soir/
├── types/
│   └── cardDeck.types.ts           # Types TypeScript pour les jeux de cartes
├── services/
│   └── cardDeckStorage.ts          # Service de stockage des jeux et images
├── app/Barbu/
│   ├── barbuGame.tsx               # Jeu principal (modifié)
│   ├── cardDeckManager.tsx         # Écran de gestion des jeux
│   └── cardDeckEditor.tsx          # Écran d'édition des images
├── components/
│   └── card.tsx                    # Composant carte (modifié)
└── assets/images/cardDecks/        # Dossier de stockage des images
```

## 💾 Stockage des données

### AsyncStorage
Les configurations des jeux de cartes sont sauvegardées dans AsyncStorage sous la clé `@card_decks_config`.

### Système de fichiers
Les images sont stockées dans le répertoire du document de l'application :
```
{documentDirectory}/cardDecks/
├── deck_123456/
│   ├── img_111111.jpg
│   ├── img_222222.jpg
│   └── ...
└── deck_789012/
    └── ...
```

## 🚀 Utilisation

### 1. Accéder à la gestion des jeux de cartes
Dans l'écran du jeu Barbu, cliquez sur le bouton "Jeux de cartes" en haut de l'écran.

### 2. Créer un nouveau jeu
1. Cliquez sur "Nouveau"
2. Entrez un nom pour votre jeu
3. Cliquez sur "Créer"

### 3. Ajouter des images à un jeu
1. Cliquez sur l'icône d'images (📷) du jeu
2. Sélectionnez la valeur de la carte (As, 2, 3, ..., Roi)
3. Sélectionnez la couleur (♥ ♦ ♣ ♠)
4. Cliquez sur "Ajouter une image depuis la galerie"
5. Choisissez votre photo
6. Répétez pour chaque carte

### 4. Activer un jeu de cartes
Cliquez sur l'icône de sélection (✓) du jeu que vous souhaitez utiliser.

### 5. Modifier ou supprimer un jeu
- Modifier le nom : cliquez sur l'icône crayon (✏️)
- Supprimer : cliquez sur l'icône poubelle (🗑️)

## 🎨 Personnalisation avancée

### Plusieurs images par carte
Vous pouvez ajouter plusieurs photos pour une même carte. Le système choisira aléatoirement l'une d'entre elles lors de l'affichage.

### Cartes sans image
Si une carte n'a pas d'image personnalisée, le système affichera automatiquement l'icône standard.

## 🔧 Configuration technique

### Dépendances installées
- `expo-image-picker` : Sélection d'images depuis la galerie
- `@react-native-async-storage/async-storage` : Stockage local
- `expo-file-system` : Gestion des fichiers

### Types principaux

```typescript
interface CardDeck {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  images: CardImage[];
  isDefault?: boolean;
}

interface CardImage {
  id: string;
  uri: string;
  value: CardValue;
  suit: CardSuit;
}
```

## ⚠️ Notes importantes

1. **Permissions** : L'application demande l'accès à la galerie lors du premier ajout d'image
2. **Jeu par défaut** : Le jeu "Jeu standard" ne peut pas être supprimé ou renommé
3. **Espace de stockage** : Les images sont copiées dans l'application, assurez-vous d'avoir suffisamment d'espace
4. **Performance** : Optimisez vos images pour de meilleures performances

## 🐛 Dépannage

### Les images ne s'affichent pas
- Vérifiez que le jeu contenant les images est bien activé
- Vérifiez que les permissions d'accès à la galerie sont accordées

### Erreur lors de l'ajout d'image
- Vérifiez l'espace de stockage disponible
- Essayez avec une image plus petite

### Le jeu ne se charge pas
- Redémarrez l'application
- Vérifiez les logs de la console pour plus de détails
