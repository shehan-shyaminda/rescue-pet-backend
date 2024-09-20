const jwt = require("jsonwebtoken");
const db = require("../config/mongo.init");
const { ref, set, onValue } = require('firebase/database');
const realtimeDB = require("../config/firebase.init");
const firebasePush = require("../config/firebase.admin.init");
const { func } = require("joi");
const { connect } = require("mongoose");

async function extractToken(authorization) {
    try {
        const decodedToken = jwt.verify(authorization[1], process.env.JWT_TOKEN_SECRET);
        return await db.user.findOne({ _id: decodedToken.userId }).exec();
    } catch (error) {
        throw error;
    }
}

function pushToFirebase(id, it) {
    set(ref(realtimeDB, id), it);
}

function fetchFromFirebase(userId, callback) {
    onValue(ref(realtimeDB, 'pets/'), (snapshot) => {
        const data = snapshot.val();
        callback(null, data);
    }, (error) => {
        callback(error, null);
    });
}

const pushMessage = async (token, payload) => {
    try {
      const messaging = await firebasePush;
      const response = await messaging.send(token, payload);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  

module.exports = { extractToken, pushToFirebase, fetchFromFirebase, pushMessage };