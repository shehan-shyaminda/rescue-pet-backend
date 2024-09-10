const ownerModel = require("../models/owner.model");
const fcmTokensModel = require("../models/fcm.tokens.model");
const petModel = require("../models/pet.model");
const jwt = require("jsonwebtoken");
const db = require("../config/mongo.init");
const makeRequired = (x) => x.required();

exports.checkValidJWT = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({ status: false, data: "Unauthorized" });
            } else {
                req.jwt = jwt.verify(authorization[1], process.env.JWT_TOKEN_SECRET);
                return next();
            }
        } catch (err) {
            return res.status(401).send({ status: false, message: "Unauthorized" });
        }
    } else {
        return res.status(401).send({ status: false, message: "Unauthorized" });
    }
};

exports.checkExistingUser = (req, res, next) => {
    db.user.find({ username: req.body.username }).exec().then(r => {
        if (r.length !== 0) {
            console.log(`existing user found`);
            return res.status(400).send({ status: false, message: "An account is already registered with your username" })
        } else {
            console.log(`existing user not found`);
            return next()
        }
    })
}

exports.userLogin = (req, res, next) => {
    const { error } = ownerModel.joiOwner.fork(['username', 'userPassword'], makeRequired).validate({
        username: req.body.username,
        userPassword: req.body.userPassword
    });
    if (error) return res.status(400).send({ status: false, message: error.details[0].message });
    return next();
}

exports.userRegister = (req, res, next) => {
    const { error } = ownerModel.joiOwner.fork(['username', 'userPassword', 'userLongitude', 'userLatitude'], makeRequired).validate({
        username: req.body.username,
        userPassword: req.body.userPassword,
        userLongitude: req.body.userLongitude,
        userLatitude: req.body.userLatitude
    });
    if (error) return res.status(400).send({ status: false, message: error.details[0].message });
    return next();
}

exports.updateSelfLocation = (req, res, next) => {
    const { error } = ownerModel.joiOwner.fork(['userLongitude', 'userLatitude'], makeRequired).validate({
        userLongitude: req.body.userLongitude,
        userLatitude: req.body.userLatitude
    });
    if (error) return res.status(400).send({ status: false, message: error.details[0].message });
    return next();
}

exports.registerFCM = (req, res, next) => {
    const { error } = fcmTokensModel.joiFcmTokens.validate({
        userId: req.body.userId,
        token: req.body.fcmToken
    });
    if (error) return res.status(400).send({ status: false, message: error.details[0].message });
    return next();
}