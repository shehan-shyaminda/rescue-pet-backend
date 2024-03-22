const Joi = require('joi');

exports.OwnerSchema = function (mongoose) {
    const mongooseOwner = new mongoose.Schema({
        username: String,
        userPassword: String,
        userPets: [{
            petsId: String,
            petsNickname: String
        }],
        userLongitude: Number,
        userLatitude: Number
    });

    return  mongoose.model(process.env.MONGOOSE_OWNERS_COLLECTION, mongooseOwner);
}

exports.joiOwner = Joi.object({
    username: Joi.string(),
    userPassword: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    userPets:  [{
        petsId: Joi.string(),
        petsNickname: Joi.string()
    }],
    userLongitude: Joi.number(),
    userLatitude: Joi.number()
})
