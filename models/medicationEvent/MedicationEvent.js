var mongoose = require("mongoose");

var MedicationEventSchema = new mongoose.Schema({
        title:{type:String,required:true},
        wasAdministered:{type:Boolean,required:true},
        reason:String,
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
        createdByStr:{type:String,required:true},
        createdBy:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Guardian'
        }
});

module.exports = mongoose.model("MedicationEvent", MedicationEventSchema);