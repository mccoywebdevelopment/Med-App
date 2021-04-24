var mongoose = require("mongoose");

var AdminNotificationSchema = new mongoose.Schema({
    dateCreated:{type:Date,required:true},
    type:{type:String,required:true},
    medicationMissed:{
        period:String,
        rxsMedication:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RxsMedication'
        },
        dependent:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dependent'
        },
        group:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    }
});

module.exports = mongoose.model("AdminNotification", AdminNotificationSchema);