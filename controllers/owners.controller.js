const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.checkLogin = (req, res) => {
    const jwtToken = jwt.sign(req.body, process.env.JWT_SECRET)
    db.user.find({username: req.body.username, password: req.body.password}).exec().then(r => {
        if (r.length !== 0) {
            res.status(200).send({
                status: true, data:
                    {
                        "user": r[0],
                        "accessToken": jwtToken
                    }
            })
        } else {
            console.log(`no user found`);
            res.status(401).send({status: false, message: 'Please Check Your Credentials'})
        }
    })
}

exports.saveNewUser = (req, res) => {
    const user = new db.user({
        userId: uuidv4(),
        username: req.body.username,
        password: req.body.password,
        userLongitude: req.body.userLongitude,
        userLatitude: req.body.userLatitude
    });
    user.save().then(r => {
        if (r.length !== 0) {
            console.log(`new user registered ${r}`);
            res.status(200).send({status: true, data: user})
        } else {
            console.log(`registration error`);
            res.status(400).send({status: false, message: 'Registration Error'});
        }
    });
}

exports.saveNewPet = (req, res) => {
    const petId = crypto.randomBytes(4).toString("hex");
    const pet = {
        petId: petId,
        userId: req.body.userId,
        petDeviceId: "pet_" + petId,
        petNickname: req.body.petNickname,
    };

    db.user.findOneAndUpdate({userId: req.body.userId}, {
        $push: {
            pets: pet
        }
    }, {new: true}).then(r => {
        if (r != null) {
            console.log(`new pet registered ${r}`);
            res.status(200).send({status: true, data: pet})
        } else {
            res.status(400).send({status: false, message: 'Update Error'});
        }
    })
}

exports.getMyPet = (req, res) => {
    db.user.findOne({userId: req.body.userId}, {pets: {$elemMatch: {petId: req.body.petId}}}).exec().then(r => {
        if (r) {
            res.status(200).send({status: true, data: r})
        } else {
            console.log(`no user found`);
            res.status(401).send({status: false, message: 'Please Check Your Credentials'})
        }
    })
}

exports.updateSelfLocation = (req, res) => {
    db.user.findOneAndUpdate({userId: req.body.userId}, {
        $set: {
            userLongitude: req.body.userLongitude,
            userLatitude: req.body.userLatitude
        }
    }, {new: true}).then(r => {
        if (r != null) {
            console.log(`user updated ${r}`);
            res.status(200).send({status: true, data: r})
        } else {
            res.status(400).send({status: false, message: 'Update Error'});
        }
    })
}
