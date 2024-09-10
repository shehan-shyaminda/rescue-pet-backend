const mongoose = require('mongoose');
const ownerModel = require('../models/owner.model');
const petModel = require('../models/pet.model');
const fcmTokensModel = require('../models/fcm.tokens.model');
const dotenv = require('dotenv')
dotenv.config()
const db = {};

const connectDatabase = async() => {
    return await mongoose.connect(process.env.MONGOOSE_CONNECTION);
}

connectDatabase().then(connection => {
    db.user = ownerModel.OwnerSchema(connection)
    db.pet = petModel.PetSchema(connection)
    db.fcmTokens = fcmTokensModel.fcmTokensSchema(connection)
})

module.exports = db;