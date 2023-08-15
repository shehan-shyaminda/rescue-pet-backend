const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");

exports.updateSelfLocation = (req, res) => {
    db.user.findOneAndUpdate({
            userId: req.body.userId,
            'pets.petId': req.body.petId
        }, {
            $set: {
                'pets.$.petLongitude': req.body.petLongitude,
                'pets.$.petLatitude': req.body.petLatitude
            }
        },
        {new: true}).then(r => {
        if (r != null) {
            const locationHistory = {
                dateTime: Date.now(),
                longitude: req.body.petLongitude,
                latitude: req.body.petLatitude,
            };

            db.user.findOneAndUpdate({
                    userId: req.body.userId,
                    'pets.petId': req.body.petId
                }, {
                    $push: {
                        locationHistory: locationHistory
                    }
                }, {new: true}).then(r => {
                if (r != null) {
                    console.log(`new pet registered ${r}`);
                    res.status(200).send({status: true, data: r})
                } else {
                    res.status(400).send({status: false, message: 'Update Error'});
                }
            })
        } else {
            res.status(400).send({status: false, message: 'Update Error'});
        }
    })
}