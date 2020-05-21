var jwt = require('jsonwebtoken');
var User = require('../models/user');

exports.generateToken = async(user) => {
    var secret = process.env.SECRET;
    try {
        var token = await jwt.sign(user.id, secret);
        return token;
    } catch (error) {
        return error;
    }
}

exports.verifyToken = async (req, res, next) => {
    
    try {
        var token = req.headers.authorization || '';
        if(token) {
            var payload = await jwt.verify(token, process.env.SECRET);
            var user = {
                userId : payload,
                token
            };

            req.user = user;
            next();
        } else {
            res.status(400).json({
                success: false,
                error: "Unauthorized user!"
            })
        }
    } catch (error) {
        next(error);
    }

}