const admin = require("firebase-admin");
const serviceAccount = require("../assets/rescue-pet-navigation-firebase-adminsdk-cv346-4e2b3fb122.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rescue-pet-navigation-default-rtdb.firebaseio.com"
});

admin.credential
  .cert(serviceAccount)
  .getAccessToken()
  .then((token) => {
    console.log('Access Token:', token.access_token);
  });
  
const firebasePush = admin.messaging();

module.exports = firebasePush;