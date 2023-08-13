const PetMiddleware = require('../middleware/pets.middleware')
const PetController = require('../controllers/pets.controller')

exports.routesConfig = function (app) {
    app.put('/pet/updateLocation', [
        PetMiddleware.validateUpdateLocation,
        PetController.updateSelfLocation
    ]);
};