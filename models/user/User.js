let mongoose = require("mongoose");
let SALT_WORK_FACTOR = 12;
let bcrypt = require('bcrypt-nodejs');
let zxcvbn = require('zxcvbn');
let getCurrentTime = require('../../config/rootHelpers').getCurrentTime

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, min: 8, select: false },
    isAdmin: { type: Boolean, default: false },
    dateCreated: Date,
    lastLoggon: Date,
    notifications: {
        type: { type: String, default: "email" },
        recieve: { type: Boolean, default: true }
    },
    auth: {
        status: {
            statusValue: { type: String, default: "pending" }
        },
        isVerified: { type: Boolean, default: false },
        dateAuthenticated: Date,
        token: String,
        expiresIn: Date
    }
});


UserSchema.pre('save', function (next) {
    if (!this.dateCreated) {
        this.dateCreated = getCurrentTime().format();
    }
    if (this.auth.status.statusValue != "pending" && this.auth.status.statusValue != "approved" && this.auth.status.statusValue != "rejected") {
        var err = "Didn't recieve a valid entry for status valid values are: pending, approved, and rejected.";
        next(err);
    } else {
        next();
    }

});

UserSchema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        next();
    } else if (typeof (user.password) == 'undefined') {
        next();
    }else if(user.password < 8){
        next("Password must have 8 charactors or more");
    }else if(zxcvbn(user.password).score < 4){
        next("Password is too guessable. Please change password with registration or forgot password.");
    }else {
            bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                if (err) {
                    next(err);
                } else {
                    // hash the password using our new salt
                    bcrypt.hash(user.password, salt, null, function (err, hash) {
                        if (err) {
                            next(err);
                        } else {
                            user.password = hash;
                            user.auth.dateAuthenticated = getCurrentTime().format();
                            user.auth.status.statusValue = "approved";
                            next();
                        }
                    });
                }
            });
    }
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        if (!isMatch) {
            cb("Invalid password");
        } else {
            cb(null, isMatch);
        }
    });
};

module.exports = mongoose.model("User", UserSchema);