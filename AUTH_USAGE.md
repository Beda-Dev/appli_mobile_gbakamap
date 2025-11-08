# 🔐 Guide d'Utilisation de l'Authentification Firebase

## 📖 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Utilisation du Hook useAuth](#utilisation-du-hook-useauth)
3. [Exemples d'Implémentation](#exemples-dimplémentation)
4. [Gestion des Erreurs](#gestion-des-erreurs)
5. [Sécurité](#sécurité)

---

## 🎯 Vue d'ensemble

L'authentification Firebase est intégrée dans l'application avec:

- ✅ Connexion Email/Password
- ✅ Inscription avec validation
- ✅ Réinitialisation mot de passe
- ✅ Protection automatique des routes
- ✅ Persistance de session
- ✅ Gestion centralisée des erreurs

### Architecture

```
services/firebase/
├── config.ts          # Configuration Firebase
└── auth.ts            # Service d'authentification

hooks/
└── useAuth.ts         # Hook React pour l'auth

components/auth/
└── AuthGuard.tsx      # Protection des routes

app/auth/
├── login.tsx          # Écran de connexion
├── signup.tsx         # Écran d'inscription
└── forgot-password.tsx # Réinitialisation
```

---

## 🎣 Utilisation du Hook useAuth

### Import

```typescript
import { useAuth } from '@/hooks/useAuth';
```

### API Disponible

```typescript
const {
  user,              // User | null - Utilisateur actuel
  loading,           // boolean - État de chargement
  error,             // string | null - Message d'erreur
  signUp,            // (data) => Promise<void>
  signIn,            // (data) => Promise<void>
  signOut,           // () => Promise<void>
  resetPassword,     // (email) => Promise<void>
  updateProfile,     // (updates) => Promise<void>
  updateEmail,       // (newEmail, password) => Promise<void>
  updatePassword,    // (currentPwd, newPwd) => Promise<void>
  deleteAccount,     // (password) => Promise<void>
  refreshToken,      // () => Promise<void>
  clearError,        // () => void
} = useAuth();
```

---

## 💡 Exemples d'Implémentation

### 1. Afficher les Informations Utilisateur

```typescript
import { useAuth } from '@/hooks/useAuth';

function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Text>Non connecté</Text>;
  }

  return (
    <View>
      <Text>Nom: {user.displayName}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Vérifié: {user.emailVerified ? 'Oui' : 'Non'}</Text>
    </View>
  );
}
```

### 2. Bouton de Connexion

```typescript
function LoginButton() {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
      // Redirection automatique par AuthGuard
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button
        title="Se connecter"
        onPress={handleLogin}
        disabled={loading}
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}
```

### 3. Bouton de Déconnexion

```typescript
function LogoutButton() {
  const { signOut, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} disabled={loading}>
      <Text>Déconnexion</Text>
    </TouchableOpacity>
  );
}
```

### 4. Protéger un Composant

```typescript
function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!user) {
    return <Text>Veuillez vous connecter</Text>;
  }

  return <Text>Contenu protégé</Text>;
}
```

### 5. Mettre à Jour le Profil

```typescript
function EditProfileScreen() {
  const { user, updateProfile, loading } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const handleUpdate = async () => {
    try {
      await updateProfile({ displayName });
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <View>
      <TextInput value={displayName} onChangeText={setDisplayName} />
      <Button
        title="Enregistrer"
        onPress={handleUpdate}
        disabled={loading}
      />
    </View>
  );
}
```

### 6. Changer le Mot de Passe

```typescript
function ChangePasswordScreen() {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChange = async () => {
    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert('Succès', 'Mot de passe changé');
      // Clear inputs
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Button title="Changer" onPress={handleChange} />
    </View>
  );
}
```

### 7. Vérifier l'Authentification dans un Service

```typescript
// services/api/community.ts
import { authService } from '@/services/firebase/auth';

export const createReport = async (data: ReportData) => {
  // Vérifier si authentifié
  if (!authService.isAuthenticated()) {
    throw new Error('Vous devez être connecté');
  }

  // Obtenir le token
  const token = await authService.getCurrentToken();
  
  // Faire l'appel API
  const response = await fetch('/api/reports', {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response.json();
};
```

---

## ⚠️ Gestion des Erreurs

### Codes d'Erreur Firebase

Les erreurs sont automatiquement traduites en français:

| Code Firebase | Message Français |
|--------------|------------------|
| `auth/email-already-in-use` | Cet email est déjà utilisé |
| `auth/invalid-email` | Email invalide |
| `auth/weak-password` | Mot de passe trop faible (minimum 6 caractères) |
| `auth/user-not-found` | Aucun compte trouvé avec cet email |
| `auth/wrong-password` | Mot de passe incorrect |
| `auth/too-many-requests` | Trop de tentatives. Réessayez plus tard |
| `auth/network-request-failed` | Erreur réseau. Vérifiez votre connexion |

### Affichage des Erreurs

```typescript
const { error, clearError } = useAuth();

// Afficher l'erreur
{error && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={clearError}>
      <Text>Fermer</Text>
    </TouchableOpacity>
  </View>
)}
```

---

## 🔒 Sécurité

### Bonnes Pratiques

#### 1. Ne Jamais Stocker de Mots de Passe

```typescript
// ❌ Mauvais
const [password, setPassword] = useState('');
AsyncStorage.setItem('password', password); // JAMAIS !

// ✅ Bon - Firebase gère la persistance
const { user } = useAuth();
// Le token est automatiquement géré et sécurisé
```

#### 2. Réauthentification pour Actions Sensibles

```typescript
// Pour changer l'email ou supprimer le compte
const { updateEmail } = useAuth();

// Firebase demande automatiquement le mot de passe actuel
await updateEmail(newEmail, currentPassword);
```

#### 3. Vérifier l'Authentification

```typescript
// Côté client
const { user } = useAuth();
if (!user) {
  router.push('/auth/login');
  return;
}

// Côté API - Vérifier le token
const token = await user.getIdToken();
// Envoyer dans les headers
```

#### 4. Logout Propre

```typescript
const handleLogout = async () => {
  try {
    await signOut(); // Nettoie tout (token, cache, etc.)
    // Clear aussi les données locales si nécessaire
    await AsyncStorage.clear();
    router.replace('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

### Validation des Entrées

```typescript
// Toujours valider avant d'envoyer
const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Utiliser avant signUp/signIn
if (!validateEmail(email)) {
  Alert.alert('Erreur', 'Email invalide');
  return;
}
```

---

## 🚀 Exemples Avancés

### Écouteur de Changements d'État

```typescript
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/config';

function MyComponent() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Utilisateur connecté:', user.email);
        // Charger les données utilisateur
      } else {
        console.log('Utilisateur déconnecté');
        // Nettoyer les données
      }
    });

    return unsubscribe; // Cleanup
  }, []);
}
```

### Rafraîchir le Token Automatiquement

```typescript
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { user, refreshToken } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Rafraîchir toutes les 50 minutes (token expire en 1h)
    const interval = setInterval(() => {
      refreshToken();
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);
}
```

---

## 📱 Intégration avec l'API Backend

```typescript
// services/api/config.ts
import { authService } from '@/services/firebase/auth';

// Le token est automatiquement ajouté dans les intercepteurs
class ApiClient {
  async request(endpoint: string) {
    const token = await authService.getCurrentToken();
    
    return fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  }
}
```

---

## 🎨 Personnalisation

### Modifier les Messages d'Erreur

Éditer `services/firebase/auth.ts`:

```typescript
private handleAuthError(error: any): Error {
  const errorMessages: { [key: string]: string } = {
    'auth/wrong-password': 'Votre message personnalisé',
    // Ajouter d'autres messages
  };
  
  const message = errorMessages[error.code] || error.message;
  return new Error(message);
}
```

### Ajouter des Providers

```typescript
// services/firebase/auth.ts
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

async signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
```

---

## 📞 Support

Pour toute question:
- Documentation Firebase: https://firebase.google.com/docs/auth
- Issues GitHub du projet
- Contact: dev@gbakamap.ci