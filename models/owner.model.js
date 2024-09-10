const Joi = require('joi');

exports.OwnerSchema = function (mongoose) {
    const mongooseOwner = new mongoose.Schema({
        username: String,
        userPassword: String,
        userPets: [{
            petsId: String,
            petsNickname: String,
            petsType: String
        }],
        userLongitude: Number,
        userLatitude: Number
    });

    return  mongoose.model(process.env.MONGOOSE_OWNERS_COLLECTION, mongooseOwner);
}

exports.joiOwner = Joi.object({
    username: Joi.string(),
    userPassword: Joi.string(),
    userPets:  [{
        petsId: Joi.string(),
        petsNickname: Joi.string(),
        petsType: Joi.string()
    }],
    userLongitude: Joi.number(),
    userLatitude: Joi.number()
})
