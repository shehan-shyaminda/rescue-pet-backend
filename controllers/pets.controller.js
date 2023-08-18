const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");

exports.updateSelfLocation = (req, res) => {
    db.user.findOneAndUpdate(
        {
            userId: req.body.userId,
            'pets.petId': req.body.petId
        },
        {
            $set: {
                'pets.$.petLongitude': req.body.petLongitude,
                'pets.$.petLatitude': req.body.petLatitude
            }
        },
        { new: true }
    ).then(r => {
        if (r != null) {
            const locationHistory = {
                dateTime: Date.now(),
                longitude: req.body.petLongitude,
                latitude: req.body.petLatitude
            };

            db.user.findOneAndUpdate(
                {
                    userId: req.body.userId,
                    'pets.petId': req.body.petId
                },
                {
                    $push: {
                        'pets.$.locationHistory': locationHistory
                    }
                },
                { new: true }
            ).then(r => {
                if (r != null) {
                    console.log(`New location added to history: ${r}`);
                    res.status(200).json({
                        status: true,
                        data: r
                    });
                } else {
                    res.status(400).json({
                        status: false,
                        message: 'Location History Update Error'
                    });
                }
            });
        } else {
            res.status(400).json({
                status: false,
                message: 'Pet Location Update Error'
            });
        }
    });
};
