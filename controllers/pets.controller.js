const db = require("../config/mongo.init");
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

exports.checkLogin = (req, res) => {
    const jwtToken = jwt.sign(req.body, process.env.JWT_SECRET)
    db.user.find({ username: req.body.username, password: req.body.password }).exec().then(r => {
        if (r.length !== 0) {
            res.status(200).send({status: true, data:
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

exports.getLogin = (req, res) => {
    db.user.find({ username: req.body.username }).exec().then(r => {
        if (r.length !== 0) {
            res.status(200).send({status: true, data: r[0]})
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
        userType: req.body.userType,
        userExerciseType: req.body.exerciseType,
        userWeight: req.body.weight,
        userHeight: req.body.height,
        userGender: req.body.gender,
        userExerciseTime: req.body.exerciseTime,
        createdAt: Date.now()
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

exports.updateUserExerciseTime = (req, res) => {
    db.user.findOneAndUpdate({ userId: req.body.userId }, {
        $set: {
            userExerciseTime: req.body.exerciseTime
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

exports.updateUserType = (req, res) => {
    db.user.findOneAndUpdate({ userId: req.body.userId }, {
        $set: {
            userType: req.body.userType
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

exports.updateUserExerciseType = (req, res) => {
    db.user.findOneAndUpdate({ userId: req.body.userId }, {
        $set: {
            userExerciseType: req.body.userExerciseType
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