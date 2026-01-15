# 🧪 Guide de test du système de jeux de cartes

## Préparation

1. Lancez l'application : `npx expo start`
2. Ouvrez sur votre appareil mobile ou émulateur
3. Naviguez vers le jeu du Barbu

## Tests à effectuer

### ✅ Test 1 : Création d'un jeu de cartes

1. Cliquez sur le bouton **"Jeux de cartes"** en haut
2. Cliquez sur **"Nouveau"**
3. Entrez un nom, par exemple "Mon jeu personnalisé"
4. Cliquez sur **"Créer"**

**Résultat attendu :**
- ✓ Message "Jeu de cartes créé avec succès"
- ✓ Le nouveau jeu apparaît immédiatement dans la liste
- ✓ Pas besoin de rafraîchir la page

### ✅ Test 2 : Ajout d'images pour une carte

1. Dans la liste des jeux, cliquez sur l'icône 📷 (Images) du jeu créé
2. Sélectionnez une valeur, par exemple **"Roi"**
3. Cliquez sur **"Ajouter une image depuis la galerie"**
4. Sélectionnez une photo de votre galerie
5. Confirmez la sélection

**Résultat attendu :**
- ✓ Demande de permission d'accès à la galerie (première fois)
- ✓ L'image apparaît dans la liste
- ✓ Message "Image ajoutée avec succès"
- ✓ Pas besoin de choisir une couleur (l'image sera utilisée pour tous les Rois)

**Note :** Vous pouvez ajouter plusieurs images pour une même carte

### ✅ Test 3 : Suppression d'une image

1. Dans l'écran d'édition d'un jeu
2. Cliquez sur l'icône 🗑️ sur une image
3. Confirmez la suppression

**Résultat attendu :**
- ✓ Popup de confirmation
- ✓ L'image disparaît après confirmation
- ✓ Message "Image supprimée"

### ✅ Test 4 : Activation d'un jeu de cartes

1. Retournez à la liste des jeux (bouton Retour)
2. Sur un jeu qui n'est pas actif, cliquez sur l'icône ✓
3. Observez le changement

**Résultat attendu :**
- ✓ Le jeu sélectionné affiche une bordure verte et une coche verte
- ✓ Message "Jeu de cartes actif modifié"

### ✅ Test 5 : Utilisation dans le jeu

1. Retournez au jeu du Barbu (bouton Retour)
2. Activez un jeu contenant des images personnalisées
3. Cliquez sur le dos de carte pour révéler des cartes

**Résultat attendu :**
- ✓ Les cartes avec images personnalisées affichent vos photos
- ✓ Les cartes sans images personnalisées affichent les icônes standard (♥ ♦ ♣ ♠)
- ✓ Si plusieurs images pour une carte, une est choisie aléatoirement

### ✅ Test 6 : Modification du nom d'un jeu

1. Dans la liste des jeux
2. Cliquez sur l'icône ✏️ (Crayon)
3. Changez le nom
4. Cliquez sur **"Enregistrer"**

**Résultat attendu :**
- ✓ Le nom change immédiatement dans la liste
- ✓ Message "Nom du jeu modifié"

### ✅ Test 7 : Suppression d'un jeu

1. Dans la liste des jeux
2. Cliquez sur l'icône 🗑️ (Poubelle) sur un jeu NON par défaut
3. Confirmez la suppression

**Résultat attendu :**
- ✓ Popup de confirmation
- ✓ Le jeu disparaît immédiatement après confirmation
- ✓ Message "Jeu de cartes supprimé"
- ✓ Si c'était le jeu actif, retour automatique au "Jeu standard"

### ❌ Test 8 : Protection du jeu par défaut

1. Essayez de modifier le nom du "Jeu standard"
2. Essayez de supprimer le "Jeu standard"

**Résultat attendu :**
- ✓ Message d'erreur "Impossible de modifier le jeu par défaut"
- ✓ Message d'erreur "Impossible de supprimer le jeu par défaut"
- ✓ Le bouton de modification/suppression ne doit pas être visible pour le jeu par défaut

## 🐛 En cas de problème

### L'image ne s'ajoute pas
- Vérifiez les permissions d'accès à la galerie
- Regardez les logs console (Expo DevTools)
- Vérifiez l'espace de stockage disponible
- Le message d'erreur devrait donner plus de détails

### Les images ne s'affichent pas dans le jeu
- Vérifiez que le bon jeu est activé (coche verte)
- Retournez au menu puis au jeu pour forcer un refresh
- Vérifiez que vous avez bien ajouté des images pour les cartes

### La liste ne se met pas à jour
- Ce problème devrait être résolu
- Si ça persiste, fermez et rouvrez l'application

### Erreur "Cannot read property..."
- Redémarrez le serveur Expo
- Videz le cache : `npx expo start -c`

## 📊 Checklist complète

- [ ] Créer un jeu de cartes
- [ ] Ajouter au moins 3 images (pour Roi, Reine, Valet par exemple)
- [ ] Ajouter 2 images pour la même carte (test de sélection aléatoire)
- [ ] Activer le jeu créé
- [ ] Tester l'affichage dans le jeu du Barbu
- [ ] Supprimer une image
- [ ] Modifier le nom du jeu
- [ ] Créer un second jeu
- [ ] Changer de jeu actif
- [ ] Supprimer un jeu

## 🎯 Comportement correct

✅ **Les listes se mettent à jour immédiatement** après chaque action  
✅ **Pas besoin de sélectionner la couleur** lors de l'ajout d'image  
✅ **Les images sont utilisées pour toutes les couleurs** de la valeur sélectionnée  
✅ **Le jeu par défaut est protégé** contre la modification et la suppression  
✅ **Les confirmations apparaissent** avant les actions de suppression  
✅ **Les messages de succès/erreur** sont affichés clairement

Bon test ! 🎴
