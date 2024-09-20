const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");
const commonUtils = require("../utilities/common.utils");
const OwnerController = require('../controllers/owners.controller')

const {TravelMode} = require("@googlemaps/google-maps-services-js");
const Joi = require("joi");
const { messaging } = require("firebase-admin");
const GoogleMapsClient = require('@googlemaps/google-maps-services-js').Client;

exports.addPet = async (req, res, next) => {
    const user = await commonUtils.extractToken(req.headers['authorization'].split(' '));
    if (user) {
        const pet = new db.pet({
            userId: user._id, 
            petNickname: req.body.petNickname, 
            petType: req.body.petType, 
            petBread: req.body.petBread, 
            petLocationHistory: {
                petLongitude: req.body.petLocationHistory.petLongitude,
                petLatitude: req.body.petLocationHistory.petLatitude,
                timeStamp: Date.now()
            }
        });
        pet.save().then(r => {
            if (r.length !== 0) {
                req.body.petId = pet._id;
                req.body.userId = pet.userId;
                return next();
            } else {
                res.status(400).send({status: false, message: 'Error Encountered'});
            }
        })
            .catch(error => {
                res.status(500).send({status: false, message: 'Error Encountered'});
            });
    } else {
        res.status(400).send({status: false, message: 'Error Encountered'});
    }
}

exports.getPet = (req, res) => {
    db.pet.findOne({_id: req.body.petId}).exec().then(r => {
        if (r) {
            console.log(r);        
            res.status(200).send({status: true, data: r})
        } else {
            res.status(400).send({status: false, message: 'Error Encountered'});
        }
    })
        .catch(error => {
            res.status(500).send({status: false, message: 'Error Encountered'});
        });
}

exports.updatePetLocation = (req, res) => {
    const newLocation = {
        petLongitude: req.body.petLongitude,
        petLatitude: req.body.petLatitude
    };
    db.pet.findOneAndUpdate({_id: req.body.petId}, {$push: {petLocationHistory: newLocation}}, {new: true})
        .then(it => {
            if (it) {
                commonUtils.pushToFirebase(req.body.petId, {
                    petLongitude: req.body.petLongitude,
                    petLatitude: req.body.petLatitude,
                    timestamp: Date.now()
                })
                res.status(200).send({status: true, data: it});
            } else {
                res.status(400).send({status: false, message: 'Error Encountered'});
            }
        })
        .catch(error => {
            res.status(500).send({status: false, message: 'Error Encountered'});
        });
};

exports.sendPush = async (req, res) => {
    db.fcmTokens.findOne({_id: req.query.userId}).exec().then(r => {
        if (r) {
            const message = {
                token: r.token,
                notification: {
                  title: 'Hello!',
                  body: 'This is a push notification from Node.js'
                },
                data: {
                  key1: 'petId',
                  key2: '123456'
                }
              };
            commonUtils.pushMessage(message).then((response) => {
              console.log('Successfully sent message:', response);
              return res.status(200).json({
                  success: true,
                  data: "Notification Success"
                });
            }).catch((error) => {
              console.log('Error sending message:', error);
              res.status(403).send({status: false, message: `Error sending message: "${error}"`});
            });
        } else {
            res.status(400).send({status: false, message: 'Error Encountered'});
        }
    })
    .catch(error => {
        res.status(500).send({status: false, message: 'Error Encountered'});
    });
};

exports.getDirection = async (req, res) => {
    try {
        const {origin, destination} = req.body;
        const originStr = `${origin.latitude},${origin.longitude}`;
        const destinationStr = `${destination.latitude},${destination.longitude}`;
        const client = new GoogleMapsClient({});
        await client.directions({
            params: {
                origin: originStr,
                destination: destinationStr,
                travelMode: TravelMode.walking,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        })
            .then(response => {
                const {data} = response;
                const maneuvers = data.routes[0].legs[0].steps;
                const actions = getActionsFromManeuvers(maneuvers);
                console.log({maneuvers});
                res.status(200).json({
                    status: true, data: actions.slice(0,2)
                });
            })
            .catch(error => {
                res.status(503).json({
                    status: false,
                    error: `Error fetching directions: ${error.response ? error.response.data : error.message}`
                });
            });
    } catch (error) {
        console.error('Error fetching next maneuver:', error);
        res.status(500).json({
            status: false, error: 'Internal Server Error'
        });
    }
};

function getActionsFromManeuvers(maneuvers) {
    return maneuvers.map(step => {
        if (step.html_instructions.includes("left")) {
            return "left";
        } else if (step.html_instructions.includes("right")) {
            return "right";
        } else {
            return "straight";
        }
    });
}
