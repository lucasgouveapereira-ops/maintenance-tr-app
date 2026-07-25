import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const STORAGE_KEY_FIREBASE_CONFIG = 'tr_firebase_config_v1';

// Default / Environment Firebase Config
export function getStoredFirebaseConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading stored Firebase config', e);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
}

export function saveStoredFirebaseConfig(config) {
  localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
  // Reload window to re-initialize firebase with new credentials
  window.location.reload();
}

export function isFirebaseConfigured() {
  const cfg = getStoredFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId);
}

// Initialize Firebase App
let app = null;
let db = null;
let auth = null;

const currentConfig = getStoredFirebaseConfig();

if (currentConfig.apiKey && currentConfig.projectId) {
  try {
    app = !getApps().length ? initializeApp(currentConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.error('Failed to initialize Firebase app', err);
  }
}

export { app, db, auth };
