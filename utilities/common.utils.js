const jwt = require("jsonwebtoken");
const db = require("../config/mongo.init");

async function extractToken(authorization) {
    try {
        const decodedToken = jwt.verify(authorization[1], process.env.JWT_TOKEN_SECRET);
        return await db.user.findOne({_id: decodedToken.userId}).exec();
    } catch (error) {
        throw error;
    }
}

module.exports = { extractToken };