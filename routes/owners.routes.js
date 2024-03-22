const OwnerController = require('../controllers/owners.controller')
const OwnerMiddleware = require('../middleware/owners.middleware')

exports.routesConfig = function(app) {

    app.post('/owner/login', [
        OwnerMiddleware.userLogin,
        OwnerController.userLogin
    ]);

    app.post('/owner/register', [
        OwnerMiddleware.userRegister,
        OwnerMiddleware.checkExistingUser,
        OwnerController.userRegister
    ]);

    app.get('/owner/getMyPet', [
        OwnerMiddleware.checkValidJWT,
        OwnerController.getMyPet
    ]);

    app.post('/owner/setLocation', [
        OwnerMiddleware.checkValidJWT,
        OwnerMiddleware.updateSelfLocation,
        OwnerController.updateSelfLocation
    ]);

    app.get('/owner/getMySelf', [
        OwnerMiddleware.checkValidJWT,
        OwnerController.getMySelf
    ])
};