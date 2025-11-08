# 🚌 GbakaMap Mobile App

Application mobile React Native pour la navigation des transports publics en Côte d'Ivoire.

## 📱 Fonctionnalités Implémentées

### ✅ Écrans Principaux
1. **Carte Interactive** (`app/(tabs)/index.tsx`)
   - Affichage de la carte avec localisation
   - Markers pour les arrêts de transport
   - Modal de détails rapides

2. **Recherche** (`app/(tabs)/search.tsx`)
   - Recherche d'arrêts par nom
   - Calcul d'itinéraire entre deux points
   - Affichage des résultats avec détails

3. **Favoris** (`app/(tabs)/favorites.tsx`)
   - Liste des arrêts favoris
   - Ajout/Suppression de favoris
   - Pull-to-refresh

4. **Profil** (`app/(tabs)/profile.tsx`)
   - Informations utilisateur
   - Statistiques (contributions, favoris)
   - Paramètres et préférences

5. **Détails Arrêt** (`app/stop/[id].tsx`)
   - Informations complètes de l'arrêt
   - Carte de localisation
   - Lignes desservies
   - Équipements disponibles

6. **Calcul Itinéraire** (`app/route/index.tsx`)
   - Saisie départ/arrivée
   - Suggestions de transport
   - Informations météo
   - Pros/Cons par mode

### 🛠️ Services API
- `services/api/config.ts` - Client API avec authentification
- `services/api/stops.ts` - Gestion des arrêts
- `services/api/lines.ts` - Gestion des lignes
- `services/api/routes.ts` - Calcul d'itinéraires
- `services/api/weather.ts` - Informations météo
- `services/api/community.ts` - Favoris et signalements

### 🎨 Composants et Styles
- `constants/theme.ts` - Thème complet (couleurs, espacements)
- `types/api.ts` - Types TypeScript pour l'API
- `hooks/useLocation.ts` - Hook de géolocalisation
- `components/map/MapView.tsx` - Composant carte réutilisable

## 🚀 Installation

### Prérequis
- Node.js 18+
- Expo CLI
- iOS Simulator / Android Emulator ou appareil physique

### Étapes

1. **Installer les dépendances**
```bash
npm install
```

2. **Installer les dépendances natives**
```bash
# Maps et localisation
npx expo install expo-location react-native-maps

# Storage et auth
npx expo install @react-native-async-storage/async-storage expo-secure-store

# Firebase
npx expo install firebase

# HTTP client
npx expo install axios

# Utilitaires
npx expo install react-native-svg
```

3. **Configuration Google Maps**
   
   Obtenir une clé API Google Maps:
   - Console Google Cloud: https://console.cloud.google.com
   - Activer: Maps SDK for iOS & Maps SDK for Android
   
   Mettre à jour `app.json`:
   ```json
   "ios": {
     "config": {
       "googleMapsApiKey": "VOTRE_CLE_IOS"
     }
   },
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "VOTRE_CLE_ANDROID"
       }
     }
   }
   ```

4. **Lancer l'application**
```bash
# Développement
npm start

# iOS
npm run ios

# Android
npm run android
```

## 📁 Structure du Projet

```
gbakamap/
├── app/
│   ├── (tabs)/               # Navigation principale
│   │   ├── index.tsx        # Carte
│   │   ├── search.tsx       # Recherche
│   │   ├── favorites.tsx    # Favoris
│   │   └── profile.tsx      # Profil
│   ├── stop/
│   │   └── [id].tsx         # Détails arrêt
│   ├── route/
│   │   └── index.tsx        # Calcul itinéraire
│   └── _layout.tsx          # Layout racine
│
├── services/
│   └── api/                 # Services API
│       ├── config.ts
│       ├── stops.ts
│       ├── lines.ts
│       ├── routes.ts
│       ├── weather.ts
│       └── community.ts
│
├── components/
│   └── map/
│       └── MapView.tsx      # Composant carte
│
├── hooks/
│   └── useLocation.ts       # Hook localisation
│
├── types/
│   └── api.ts               # Types TypeScript
│
└── constants/
    └── theme.ts             # Thème de l'app
```

## 🔐 Configuration Firebase Auth

### 1. Créer un Projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquer sur "Ajouter un projet"
3. Nommer le projet "GbakaMap"
4. Suivre les étapes de création

### 2. Activer l'Authentification

1. Dans le menu Firebase, aller dans **Authentication**
2. Cliquer sur "Commencer"
3. Activer les méthodes de connexion:
   - **Email/Mot de passe** ✅
   - (Optionnel) Google, Facebook, etc.

### 3. Obtenir les Configurations

#### Pour Web/React Native:

1. Dans **Paramètres du projet** > **Général**
2. Descendre jusqu'à "Vos applications"
3. Cliquer sur l'icône Web `</>`
4. Copier la configuration `firebaseConfig`

#### Exemple de configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gbakamap.firebaseapp.com",
  projectId: "gbakamap",
  storageBucket: "gbakamap.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};
```

### 4. Mettre à Jour la Configuration

Modifier `services/firebase/config.ts`:

```typescript
const firebaseConfig = {
  // Remplacer par vos vraies valeurs
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID",
};
```

### 5. Tester l'Authentification

```bash
# Lancer l'app
npm start

# L'app devrait:
# 1. Afficher l'écran de connexion au démarrage
# 2. Permettre l'inscription d'un nouveau compte
# 3. Rediriger vers l'app après connexion
```

### 6. Fonctionnalités Auth Implémentées

✅ **Connexion** (`/auth/login`)
- Email + Mot de passe
- Validation des champs
- Gestion des erreurs
- Mode invité disponible

✅ **Inscription** (`/auth/signup`)
- Création de compte
- Validation des données
- Acceptation des CGU
- Vérification mot de passe

✅ **Réinitialisation** (`/auth/forgot-password`)
- Email de réinitialisation
- Confirmation d'envoi
- Renvoi possible

✅ **Profil Utilisateur**
- Affichage des infos
- Déconnexion sécurisée
- Stats utilisateur

✅ **Protection des Routes**
- AuthGuard automatique
- Redirection si non connecté
- Persistance de session

### 7. Sécurité Firebase

#### Règles Firestore (si utilisé):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Autoriser lecture publique des arrêts
    match /stops/{stopId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Favoris privés
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    
    // Signalements
    match /reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 8. Variables d'Environnement (Optionnel)

Créer `.env`:
```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

Puis dans `config.ts`:
```typescript
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  // etc...
};
```

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env`:
```bash
API_BASE_URL=https://gbaka-maps.vercel.app
GOOGLE_MAPS_API_KEY_IOS=your_key
GOOGLE_MAPS_API_KEY_ANDROID=your_key
```

### Firebase (Optionnel)

1. Créer un projet Firebase
2. Télécharger les configs:
   - `google-services.json` (Android) → `/android/app/`
   - `GoogleService-Info.plist` (iOS) → `/ios/`

3. Initialiser dans l'app:
```typescript
// services/firebase.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // Votre config
};

const app = initializeApp(firebaseConfig);
```

## 🎯 Fonctionnalités à Ajouter

### Phase 2 - Améliorations
- [ ] Firebase Authentication
- [ ] Upload d'images pour signalements
- [ ] Mode hors-ligne complet
- [ ] Notifications push
- [ ] Animations avec Reanimated
- [ ] Thème sombre complet
- [ ] Onboarding utilisateur

### Phase 3 - Avancé
- [ ] Chat communautaire
- [ ] Horaires en temps réel
- [ ] Partage d'itinéraires
- [ ] Évaluations d'arrêts
- [ ] Historique de trajets
- [ ] Gamification (badges)

## 🐛 Debug

### Problèmes Courants

**Maps ne s'affiche pas:**
- Vérifier la clé API Google Maps
- Vérifier les permissions de localisation
- Regarder les logs: `npx expo start --dev-client`

**Erreurs de build:**
```bash
# Nettoyer le cache
npx expo start -c

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

**Localisation ne fonctionne pas:**
- Vérifier les permissions dans `app.json`
- Autoriser dans les paramètres du téléphone
- Tester sur appareil réel (simulateur peut avoir des problèmes)

## 📱 Build de Production

### Android (APK)
```bash
eas build --platform android --profile production
```

### iOS (IPA)
```bash
eas build --platform ios --profile production
```

## 📚 Documentation API

Voir `documentation API.md` pour tous les endpoints disponibles.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir LICENSE.md

## 👥 Équipe

GbakaMap Team - Côte d'Ivoire 🇨🇮

---

**Made with ❤️ for Côte d'Ivoire**"# appli_mobile_gbakamap" 
