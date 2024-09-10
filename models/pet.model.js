const { timeStamp } = require('@google/maps/lib/internal/convert');
const Joi = require('joi');

exports.PetSchema = function (mongoose) {
    const mongoosePet = new mongoose.Schema({
        userId: String,
        petNickname: String,
        petLocationHistory: [{
            petLongitude: String,
            petLatitude: String,
            timeStamp: String
        }],
        petType: String,
        petBread: String
    });

    return  mongoose.model(process.env.MONGOOSE_PETS_COLLECTION, mongoosePet);
}

exports.joiPet = Joi.object({
    userId: Joi.string(),
    petNickname: Joi.string(),
    petLocationHistory: [{
        petLongitude: Joi.string(),
        petLatitude: Joi.string(),
        timeStamp: Joi.string()
    }],
    petType: Joi.string(),
    petBread: Joi.string()
})
