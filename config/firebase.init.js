const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_CONSOLE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_ID,
  messagingSenderId: process.env.FIREBASE_CONSOLE_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebase = initializeApp(firebaseConfig);
const realtimeDB = getDatabase(firebase);

module.exports = realtimeDB;