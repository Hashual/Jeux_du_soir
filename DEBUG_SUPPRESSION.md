# 🐛 Debug - Suppression de jeux de cartes

## Logs ajoutés

La fonction de suppression a été améliorée avec des logs détaillés pour identifier le problème.

### Où voir les logs

1. **Ouvrez l'application avec Expo**
   ```bash
   npx expo start
   ```

2. **Ouvrez les DevTools**
   - Appuyez sur `j` dans le terminal pour ouvrir le debugger
   - Ou ouvrez le navigateur sur `http://localhost:8081/debugger-ui/`
   - Ou utilisez React Native Debugger

3. **Ouvrez la console du navigateur** (F12) pour voir les logs

### Logs à surveiller lors de la suppression

Quand vous tentez de supprimer un jeu, vous devriez voir :

```
Demande de suppression du jeu: deck_XXXXX Nom du jeu
Suppression confirmée, appel deleteCardDeck...
Début suppression du jeu: deck_XXXXX
Configuration chargée: [object]
Tentative suppression dossier: file:///.../cardDecks/deck_XXXXX/
Dossier supprimé (ou Dossier n'existe pas)
Nombre de jeux après filtrage: X
Jeu actif remis à default (si applicable)
Configuration sauvegardée
deleteCardDeck terminé, rafraîchissement...
Config rechargée: X jeux
```

### Test rapide

1. Créez un nouveau jeu de cartes
2. Essayez de le supprimer
3. Observez les logs dans la console
4. Vérifiez si le jeu disparaît de la liste

### Améliorations apportées

✅ **Logs détaillés** à chaque étape  
✅ **Gestion d'erreur robuste** pour la suppression du dossier  
✅ **Message d'erreur détaillé** dans l'alerte si échec  
✅ **Vérification que le jeu existe** avant suppression  

### Si ça ne fonctionne toujours pas

Envoyez-moi :
1. Les logs de la console
2. Le message d'erreur exact
3. Les étapes que vous avez suivies

## Test manuel avec AsyncStorage

Si vous voulez vérifier manuellement le stockage :

1. Installez React Native Debugger ou utilisez les DevTools
2. Dans la console, tapez :
   ```javascript
   import('@react-native-async-storage/async-storage').then(AsyncStorage => {
     AsyncStorage.default.getItem('@card_decks_config').then(console.log);
   });
   ```
3. Vous verrez la configuration JSON avec tous les jeux

## Forcer la réinitialisation (en cas de besoin)

Si vous voulez repartir de zéro :

```javascript
import('@react-native-async-storage/async-storage').then(AsyncStorage => {
  AsyncStorage.default.removeItem('@card_decks_config');
  console.log('Storage réinitialisé');
});
```

Puis relancez l'application.
