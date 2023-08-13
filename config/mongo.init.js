const mongoose = require('mongoose');
const userModel = require('../models/user.model');
const exerciseModel = require('../models/exercise.model');
const scheduleModel = require("../models/schedule.model");
const dotenv = require('dotenv')
dotenv.config()
const db = {};

const connectDatabase = async() => {
    return await mongoose.connect(process.env.MONGOOSE_CONNECTION);
}

connectDatabase().then(connection => {
    db.user = userModel.UserSchema(connection)
    db.exercise = exerciseModel.ExerciseSchema(connection)
    db.schedule = scheduleModel.ScheduleSchema(connection)
})

module.exports = db;