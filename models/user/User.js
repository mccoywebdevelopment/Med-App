const mongoose = require("mongoose");
const SALT_WORK_FACTOR = 12;
const bcrypt   = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,min:8,select: false},
    isAdmin:{type:Boolean,default:false},
    dateCreated:Date,
    lastLoggon:Date,
    timeZone:{type:String,required:true,default:"America/Phoenix"},
    auth:{
        status:{
            statusValue:{type:String,default:"pending"}
        },
        isVerified:{type:Boolean,default:false},
        dateAuthenticated:Date,
        token:String,
        expiresIn:Date
    }
});

UserSchema.pre('save',function(next){
    if(!this.dateCreated){
        this.dateCreated = new Date();
    }
    if(this.auth.status.statusValue != "pending" && this.auth.status.statusValue != "approved" && this.auth.status.statusValue != "rejected"){
        var err = "Didn't recieve a valid entry for status valid values are: pending, approved, and rejected.";
        next(err);
    }else{
        next();
    }
   
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password') ){
        next();
    }else if(typeof(user.password)=='undefined' || user.password.length<8){
        next();
    }else{
        // generate a salt
        user.auth.dateAuthenticated = new Date();
        user.auth.status.statusValue = "approved";
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err){
                next(err);
            }else{
                // hash the password using our new salt
            bcrypt.hash(user.password, salt,null,function(err, hash) {
                if (err){
                    next(err);
                }else{
                    // override the cleartext password with the hashed one
                    user.password = hash;
                    next();
                }
            });
            }
        });
    }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        if(!isMatch){
            cb("Invalid password");
        }else{
            cb(null, isMatch);
        }
    });
};

module.exports = mongoose.model("User", UserSchema);