import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

const firebaseAuth = require('firebase/auth') as {
  getAuth: typeof import('firebase/auth').getAuth
  initializeAuth?: typeof import('firebase/auth').initializeAuth
  getReactNativePersistence?: (storage: typeof AsyncStorage) => unknown
}

export const auth = firebaseAuth.getReactNativePersistence && firebaseAuth.initializeAuth
  ? firebaseAuth.initializeAuth(app, {
      persistence: firebaseAuth.getReactNativePersistence(AsyncStorage) as any,
    })
  : firebaseAuth.getAuth(app)
export const db = getFirestore(app)
