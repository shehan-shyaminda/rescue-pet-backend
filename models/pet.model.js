const Joi = require('joi');

exports.OwnerSchema = function (mongoose) {
    const mongooseOwner = new mongoose.Schema({
        userId: String,
        username: String,
        password: String,
        pets: Array,
        userLongitude: String,
        userLatitude: Number
    });

    return  mongoose.model(process.env.MONGOOSE_USERS_COLLECTION, mongooseOwner);
}

exports.joiOwner = Joi.object({
    userId: Joi.string(),
    username: Joi.string(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    pets: Joi.array(),
    userLongitude: Joi.number(),
    userLatitude: Joi.number()
})
