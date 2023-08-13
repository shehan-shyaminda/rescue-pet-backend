const Joi = require('joi');

exports.PetSchema = function (mongoose) {
    const mongoosePet = new mongoose.Schema({
        petId: String,
        userId: String,
        petDeviceId: String,
        petNickname: String,
        petLocationHistory: Array,
        petLongitude: String,
        petLatitude: Number
    });

    return  mongoose.model(process.env.MONGOOSE_PETS_COLLECTION, mongoosePet);
}

exports.joiPet = Joi.object({
    petId: Joi.string(),
    userId: Joi.string(),
    petDeviceId: Joi.string(),
    petNickname: Joi.string(),
    petLocationHistory: Joi.array(),
    petLongitude: Joi.number(),
    petLatitude: Joi.number()
})
