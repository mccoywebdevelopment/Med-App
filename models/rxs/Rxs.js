var mongoose = require("mongoose");

var RxsSchema = new mongoose.Schema({
    rxsNumber:{type:Number,required:true},

    doctorContacts:{
        name:{
            firstName:{type:String,required:true},
            lastName:{type:String,required:true}
        },
        phoneNumber:{type:String,required:true}
    },
    rxsMedications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RxsMedication'
    }]
});

module.exports = mongoose.model("Rxs", RxsSchema);