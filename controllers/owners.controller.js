const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");

exports.checkLogin = (req, res) => {
    const jwtToken = jwt.sign(req.body, process.env.JWT_SECRET)
    db.user.find({username: req.body.username, password: req.body.password}).exec().then(r => {
        if (r.length !== 0) {
            res.status(200).send({
                status: true, data:
                    {
                        "user": r[0],
                        "access_token": jwtToken
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
    const user = new db.user({
        petId: uuidv4(),
        petNickname: req.body.petNickname,
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