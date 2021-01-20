const User = require('../models/user/User');

function verifyUser(req, res, next) {
    var todayDate = new Date();
    var token = req.params.JWT;
    if (typeof (token) == 'undefined' || !token) {
        token = req.body.JWT;
    }
    if (!token) {
        next({ error: "Token is undefined." });
    } else {
        User.findOne({ "auth.token": token }, function (err, userFound) {
            if (err) {
                next({ error: err });
            } else if (!userFound) {
                next({ error: "User not found." });
            } else if (!userFound.auth.isVerified) {
                next({ error: "User is not verified" });
            } else if (todayDate > userFound.auth.expiresIn) {
                next({ error: "Token expired" })
            } else {
                req.user = userFound;
                next();
            }
        });
    }
}
function verifyAdmin(req, res, next) {
    var todayDate = new Date();
    var token = req.params.JWT;
    if (typeof (token) == 'undefined' || !token) {
        token = req.body.JWT;
    }
    if (!token) {
        next({ error: "Token is undefined." });
    } else {
        User.findOne({ "auth.token": token }, function (err, userFound) {
            if (err) {
                next({ error: err });
            } else if (!userFound) {
                next({ error: "User not found." });
            } else if (!userFound.auth.isVerified) {
                next({ error: "User is not verified" });
            } else if (!userFound.isAdmin) {
                next({ error: "User does not have admin rights." })
            } else if (todayDate > userFound.auth.expiresIn) {
                next({ error: "Token expired" })
            } else {
                req.user = userFound;
                next();
            }
        });
    }
}
function findUserByJwt(jwt, callback) {
    User.findOne({ 'auth.token': jwt }, function (err, userFound) {
        if (err) {
            callback(err);
        } else if (!userFound) {
            callback("user not found");
        } else {
            callback(null, userFound);
        }
    });
}
function addDetailsToUser(guardian, user) {
    if (guardian) {
        user = JSON.parse(JSON.stringify(user));
        user.phoneNumber = guardian.phoneNumber || "";

        if (guardian.name && guardian.name.firstName && guardian.name.lastName) {
            user.name = guardian.name.firstName + " " + guardian.name.lastName;
        } else {
            user.name = "";
        }
    }

    return user;
}
module.exports = { verifyUser, verifyAdmin, findUserByJwt, addDetailsToUser };