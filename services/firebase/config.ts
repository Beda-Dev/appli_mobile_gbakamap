// services/firebase/config.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';

// Configuration Firebase
// Remplacer par vos propres valeurs depuis Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gbakamap.firebaseapp.com",
  projectId: "gbakamap",
  storageBucket: "gbakamap.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};

// Initialiser Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialiser Auth avec persistance AsyncStorage
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Si déjà initialisé, récupérer l'instance existante
  auth = getAuth(app);
}

export { auth };
export default app;