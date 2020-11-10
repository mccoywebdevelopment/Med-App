var mongoose = require("mongoose");

var MedicationEventSchema = new mongoose.Schema({
        title:{type:String,required:true},
        isAway:{type:Boolean,default:false},
        dateTaken:{type:Date,required:true},
        notes:String,
        event:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event'
        },
        dependent:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Dependent'
        },
        createdBy:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Guardian'
        }
});

module.exports = mongoose.model("MedicationEvent", MedicationEventSchema);