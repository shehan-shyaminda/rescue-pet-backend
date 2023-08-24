const OwnerController = require('../controllers/owners.controller')
const OwnerMiddleware = require('../middleware/owners.middleware')

exports.routesConfig = function(app) {
    app.post('/owner/register', [
        OwnerMiddleware.validateNewUser,
        OwnerMiddleware.checkExistingUser,
        OwnerController.saveNewUser
    ]);

    app.post('/owner/login', [
        OwnerMiddleware.validateLogin,
        OwnerController.checkLogin
    ]);

    app.post('/owner/addPet', [
        OwnerMiddleware.checkValidJWT,
        OwnerMiddleware.validateAddPet,
        OwnerController.saveNewPet
    ]);

    app.get('/owner/getMyPet', [
        OwnerMiddleware.checkValidJWT,
        OwnerMiddleware.validatePet,
        OwnerController.getMyPet
    ]);

    app.put('/owner/setLocation', [
        OwnerMiddleware.checkValidJWT,
        OwnerMiddleware.validateUpdateOwnerLocation,
        OwnerController.updateSelfLocation
    ]);

    app.get('/owner/getMySelf', [
        OwnerMiddleware.checkValidJWT,
        OwnerController.getMySelf
    ])
};