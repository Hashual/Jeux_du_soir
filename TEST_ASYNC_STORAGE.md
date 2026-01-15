# 🔍 Test AsyncStorage sur Web

## Script de diagnostic

Copiez-collez ce code dans la console du navigateur (F12) pour diagnostiquer le problème :

```javascript
// 1. Vérifier la configuration actuelle
async function checkConfig() {
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  const config = await AsyncStorage.default.getItem('@card_decks_config');
  console.log('=== Configuration actuelle ===');
  if (config) {
    const parsed = JSON.parse(config);
    console.log('Nombre de jeux:', parsed.decks.length);
    console.log('Jeux:', parsed.decks.map(d => ({id: d.id, name: d.name})));
    console.log('Jeu actif:', parsed.activeDeckId);
    console.log('Config complète:', parsed);
  } else {
    console.log('Aucune configuration trouvée');
  }
}
checkConfig();
```

## Test manuel de suppression

```javascript
async function testDelete(deckId) {
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  
  // Charger la config
  const configStr = await AsyncStorage.default.getItem('@card_decks_config');
  const config = JSON.parse(configStr);
  
  console.log('Avant suppression:', config.decks.length, 'jeux');
  console.log('Jeux:', config.decks.map(d => d.name));
  
  // Supprimer le jeu
  config.decks = config.decks.filter(d => d.id !== deckId);
  
  // Si c'était le jeu actif, revenir au défaut
  if (config.activeDeckId === deckId) {
    config.activeDeckId = 'default';
  }
  
  console.log('Après suppression:', config.decks.length, 'jeux');
  console.log('Jeux:', config.decks.map(d => d.name));
  
  // Sauvegarder
  await AsyncStorage.default.setItem('@card_decks_config', JSON.stringify(config));
  console.log('Config sauvegardée !');
  
  // Vérifier que c'est bien sauvegardé
  const verif = await AsyncStorage.default.getItem('@card_decks_config');
  const verifParsed = JSON.parse(verif);
  console.log('Vérification:', verifParsed.decks.length, 'jeux');
}

// Utilisez l'ID du jeu à supprimer
// testDelete('deck_1234567890');
```

## Lister tous les jeux

```javascript
async function listDecks() {
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  const config = await AsyncStorage.default.getItem('@card_decks_config');
  if (config) {
    const parsed = JSON.parse(config);
    console.log('=== Liste des jeux ===');
    parsed.decks.forEach(deck => {
      console.log(`- ${deck.name} (ID: ${deck.id}, Actif: ${deck.id === parsed.activeDeckId})`);
    });
  }
}
listDecks();
```

## Réinitialiser complètement

```javascript
async function reset() {
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  await AsyncStorage.default.removeItem('@card_decks_config');
  console.log('Storage réinitialisé ! Rechargez la page.');
}
// reset();
```

## Test après suppression dans l'app

Après avoir tenté de supprimer un jeu dans l'application :

1. Regardez les logs dans la console
2. Exécutez `checkConfig()` pour voir si la suppression a été effectuée
3. Rechargez la page et vérifiez si le jeu réapparaît

## Ce qu'on cherche à savoir

- ✅ La config est-elle bien chargée ?
- ✅ La suppression modifie-t-elle la config en mémoire ?
- ✅ La config est-elle bien sauvegardée dans AsyncStorage ?
- ✅ Le rechargement récupère-t-il la bonne config ?
- ✅ Le state React se met-il à jour ?

## Si le problème persiste

**Cas 1 : La config n'est pas sauvegardée**
→ Problème avec AsyncStorage sur web

**Cas 2 : La config est sauvegardée mais la liste ne se met pas à jour**
→ Problème de re-render React

**Cas 3 : La config est sauvegardée mais revient à l'ancienne après rechargement**
→ Problème de cache ou de timing

Envoyez-moi les résultats des tests ci-dessus ! 🔍
