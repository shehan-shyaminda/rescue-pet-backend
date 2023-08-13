const petModel = require("../models/pet.model");
const db = require("../config/mongo.init");
const makeRequired = (x) => x.required();

exports.validateUpdateLocation = (req, res, next) => {
    const { error } = petModel.joiPet.fork(['userId', 'petId', 'petLongitude', 'petLatitude'], makeRequired).validate({
        userId: req.body.userId,
        petId: req.body.petId,
        petLongitude: req.body.petLongitude,
        petLatitude: req.body.petLatitude
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}