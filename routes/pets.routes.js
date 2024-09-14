const PetMiddleware = require('../middleware/pets.middleware')
const OwnerMiddleware = require('../middleware/owners.middleware')
const OwnerController = require('../controllers/owners.controller')
const PetController = require('../controllers/pets.controller')

exports.routesConfig = function (app) {

    app.post('/pet/addPet', [
        OwnerMiddleware.checkValidJWT,
        PetMiddleware.addPet,
        PetController.addPet,
        OwnerController.addPet
    ]);

    app.post('/pet/getPet', [
        OwnerMiddleware.checkValidJWT,
        PetMiddleware.getPet,
        PetController.getPet
    ])

    app.post('/pet/updateLocation', [
        OwnerMiddleware.checkValidJWT,
        PetMiddleware.updatePetLocation,
        PetController.updatePetLocation
    ]);

    app.post('/pet/getDirection', [
        OwnerMiddleware.checkValidJWT,
        PetController.getDirection
    ]);

    app.post('/pet/sendNotification',[
        PetMiddleware.sendPush,
        PetController.sendPush
    ])
};