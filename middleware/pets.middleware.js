const petModel = require("../models/pet.model");
const db = require("../config/mongo.init");
const makeRequired = (x) => x.required();

exports.updateUserExerciseTime = (req, res, next) => {
    const { error } = petModel.joiPet.fork(['userId','userExerciseTime'], makeRequired).validate({
        userId: req.body.userId,
        userExerciseTime: req.body.exerciseTime
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}