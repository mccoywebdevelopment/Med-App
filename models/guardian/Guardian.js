var mongoose = require("mongoose");

var GuardianSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        firstName:String,
        lastName:String
    },
    phoneNumber:String,
    pictureUrl:String
});

module.exports = mongoose.model("Guardian", GuardianSchema);