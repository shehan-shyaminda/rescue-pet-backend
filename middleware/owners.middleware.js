const ownerModel = require("../models/owner.model");
const petModel = require("../models/pet.model");
const jwt = require("jsonwebtoken");
const db = require("../config/mongo.init");
const makeRequired = (x) => x.required();

exports.validateLogin = (req, res, next) => {
    const {error} = ownerModel.joiOwner.fork(['username', 'password'], makeRequired).validate({
        username: req.body.username,
        password: req.body.password
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.validateNewUser = (req, res, next) => {
    const {error} = ownerModel.joiOwner.fork(['username', 'password', 'userLongitude', 'userLatitude'], makeRequired).validate({
        username: req.body.username,
        password: req.body.password,
        userLongitude: req.body.userLongitude,
        userLatitude: req.body.userLatitude
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.validateAddPet = (req, res, next) => {
    const {error: ownerModelError} = ownerModel.joiOwner.fork(['userId'], makeRequired).validate({
        userId: req.body.userId
    });
    const {error: petModelError} = petModel.joiPet.fork(['petNickname','petType','petBread'], makeRequired).validate({
        petNickname: req.body.petNickname,
        petType: req.body.petType,
        petBread: req.body.petBread
    });

    if (ownerModelError || petModelError) return res.status(400).send({
        status: false,
        message: ownerModelError ? ownerModelError.details[0].message : petModelError.details[0].message
    });
    return next();
}

exports.validatePet = (req, res, next) => {
    const {error} = petModel.joiPet.fork(['userId', 'petId'], makeRequired).validate({
        userId: req.body.userId,
        petId: req.body.petId
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.validateUpdateOwnerLocation = (req, res, next) => {
    const {error} = ownerModel.joiOwner.fork(['userId', 'userLongitude', 'userLatitude'], makeRequired).validate({
        userId: req.body.userId,
        userLongitude: req.body.userLongitude,
        userLatitude: req.body.userLatitude
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.checkValidJWT = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({status: false, data: "Unauthorized"});
            } else {
                req.jwt = jwt.verify(authorization[1], process.env.JWT_SECRET);
                return next();
            }

        } catch (err) {
            return res.status(401).send({status: false, message: "Unauthorized"});
        }
    } else {
        return res.status(401).send({status: false, message: "Unauthorized"});
    }
};

exports.checkExistingUser = (req, res, next) => {
    db.user.find({username: req.body.username}).exec().then(r => {
        if (r.length !== 0) {
            console.log(`existing user found`);
            return res.status(400).send({status: false, message: "An account is already registered with your username"})
        } else {
            console.log(`existing user not found`);
            return next()
        }
    })
}