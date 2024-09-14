const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyC-J3gVF1gL77j-okoeS_rW9D_D7V5_QSs",
  authDomain: "rescue-pet-navigation.firebaseapp.com",
  databaseURL: "https://rescue-pet-navigation-default-rtdb.firebaseio.com",
  projectId: "rescue-pet-navigation",
  storageBucket: "rescue-pet-navigation.appspot.com",
  messagingSenderId: "1084289306169",
  appId: "1:1084289306169:web:49f7c1a9fc36141f7b47e8",
  measurementId: "G-XTWV4RMTBY"
};

const firebase = initializeApp(firebaseConfig);
const realtimeDB = getDatabase(firebase);

module.exports = realtimeDB;