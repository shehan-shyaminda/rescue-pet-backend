const admin = require('firebase-admin');
const accessSecret = require('/etc/secrets/google.cloud.secret.json');

async function initializeFirebase() {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(accessSecret),
      databaseURL: process.env.FIREBASE_DATABASE_URL // Ensure the environment variable is set properly
    });

    console.log('Firebase initialized successfully.');
    return admin.messaging(); // Return the Firebase messaging instance
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

// Export the Firebase Messaging instance once initialized
const firebasePush = initializeFirebase();

module.exports = firebasePush