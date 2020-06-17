var mongoose = require("mongoose");

var GuardianSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    name:{
        firstName:{type:String,required:true},
        lastName:{type:String,required:true}
    },
    phoneNumber:{type:Number,required:true},
    pictureUrl:String
});

module.exports = mongoose.model("Guardian", GuardianSchema);