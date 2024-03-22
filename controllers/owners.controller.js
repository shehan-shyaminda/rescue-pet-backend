const db = require("../config/mongo.init");
const commonUtils = require("../utilities/common.utils");
const jwt = require("jsonwebtoken");

exports.userLogin = (req, res) => {
    db.user.findOne({username: req.body.username}).exec()
        .then(r => {
            if (!r) {
                return res.status(400).json({status: false, message: 'Invalid credentials'});
            }
            if (req.body.userPassword !== r.userPassword) {
                return res.status(400).json({status: false, message: 'Invalid credentials'});
            }
            const payload = {
                userId: r._id, username: r.username
            };
            const jwtToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET)
            return res.status(200).send({
                status: true, data: {
                    "user": r, "access_token": jwtToken
                }
            })
        })
        .catch(error => {
            res.status(500).send({status: false, message: 'Error Encountered'});
        });
}

exports.userRegister = (req, res) => {
    const user = new db.user({
        username: req.body.username,
        password: req.body.userPassword,
        userLongitude: req.body.userLongitude,
        userLatitude: req.body.userLatitude
    });
    user.save().then(r => {
        if (r.length !== 0) {
            res.status(200).send({status: true, data: user})
        } else {
            res.status(400).send({status: false, message: 'Error Encountered'});
        }
    })
        .catch(error => {
            res.status(500).send({status: false, message: 'Error Encountered'});
        });
}

exports.getMyPet = (req, res) => {
    db.user.findOne({_id: req.body.userId}).exec().then(r => {
        if (r) {
            if (req.query.petsId) {
                const pet = r.userPets.find(pet => pet.petsId === req.query.petsId);
                if (pet) {
                    res.status(200).send({status: true, data: pet})
                } else {
                    res.status(400).send({status: false, message: 'Error Encountered'});
                }
            } else {
                res.status(200).send({status: true, data: r.userPets})
            }
        } else {
            res.status(400).send({status: false, message: 'Error Encountered'});
        }
    })
        .catch(error => {
            res.status(500).send({status: false, message: 'Error Encountered'});
        });
}

exports.updateSelfLocation = async (req, res) => {
    const user = await commonUtils.extractToken(req.headers['authorization'].split(' '));
    db.user.findOneAndUpdate({_id: user._id}, {
        $set: {
            userLongitude: req.body.userLongitude, userLatitude: req.body.userLatitude
        }
    }, {new: true})
        .then(r => {
            if (r != null) {
                res.status(200).send({status: true, data: r})
            } else {
                res.status(400).send({status: false, message: 'Error Encountered'});
            }
        })
        .catch(error => {
            res.status(500).send({status: false, message: 'Error Encountered'});
        });
}

exports.getMySelf = async (req, res) => {
    const user = await commonUtils.extractToken(req.headers['authorization'].split(' '));
    if (user) {
        res.status(200).send({status: true, data: user})
    } else {
        res.status(400).send({status: false, message: 'Error Encountered'});
    }
}

exports.addPet = async (req, res) => {
    const newPet = {
        petsNickname: req.body.petNickname, petsId: req.body.petId
    };
    db.user.findOneAndUpdate({_id: req.body.userId}, {$push: {userPets: newPet}}, {new: true})
        .then(updatedUser => {
            if (updatedUser) {
                res.status(200).send({status: true, data: updatedUser});
            } else {
                res.status(400).send({status: false, message: 'Error Encountered'});
            }
        })
        .catch(error => {
            res.status(500).send({status: false, message: 'Error Encountered'});
        });
}