const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");
const commonUtils = require("../utilities/common.utils");
const OwnerController = require('../controllers/owners.controller')

const {TravelMode} = require("@googlemaps/google-maps-services-js");
const Joi = require("joi");
const GoogleMapsClient = require('@googlemaps/google-maps-services-js').Client;

exports.addPet = async (req, res, next) => {
    const user = await commonUtils.extractToken(req.headers['authorization'].split(' '));
    if (user) {
        const pet = new db.pet({
            userId: user._id, petNickname: req.petNickname, petType: req.body.petType, petBread: req.body.petBread
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

exports.getPet = (req, res, next) => {
    db.pet.findOne({_id: req.body.petId}).exec().then(r => {
        if (r) {
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
