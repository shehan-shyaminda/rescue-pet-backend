const petModel = require("../models/pet.model");
const ownerModel = require("../models/pet.model");
const db = require("../config/mongo.init");
const makeRequired = (x) => x.required();

exports.addPet = (req, res, next) => {
    const {error} = petModel.joiPet.fork(['petNickname','petType','petBread'], makeRequired).validate({
        petNickname: req.body.petNickname,
        petType: req.body.petType,
        petBread: req.body.petBread
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.getPet = (req, res, next) => {
    if (!req.body.petId) {
        return res.status(400).send({ status: false, message: 'petId is required' });
    }
    return next();
}

exports.updatePetLocation = (req, res, next) => {
    if (!req.body.petId) {
        return res.status(400).send({ status: false, message: 'petId is required' });
    }if (!req.body.petLongitude) {
        return res.status(400).send({ status: false, message: 'petLongitude is required' });
    }if (!req.body.petLatitude) {
        return res.status(400).send({ status: false, message: 'petLatitude is required' });
    }
    return next();
}





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
