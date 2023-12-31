const mongoose = require('mongoose');
const ownerModel = require('../models/owner.model');
const dotenv = require('dotenv')
dotenv.config()
const db = {};

const connectDatabase = async() => {
    return await mongoose.connect(process.env.MONGOOSE_CONNECTION);
}

connectDatabase().then(connection => {
    db.user = ownerModel.OwnerSchema(connection)
})

module.exports = db;