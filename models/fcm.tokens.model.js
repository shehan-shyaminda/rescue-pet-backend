const Joi = require('joi');

exports.FcmTokensSchema = function (mongoose) {
    const mongooseFcmTokems = new mongoose.Schema({
        userId: String,
        token: String,
        createdAt: String,
    });

    return  mongoose.model(process.env.MONGOOSE_FCM_COLLECTION, mongooseFcmTokems);
}

exports.joiFcmTokens = Joi.object({
    userId: Joi.string(),
    token: Joi.string(),
    createdAt: Joi.string()
})
