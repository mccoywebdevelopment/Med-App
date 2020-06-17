var mongoose = require("mongoose");

var MedicationSchema = new mongoose.Schema({
    name:{type:String,required:true},
    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicationEvent'
    }]
});

module.exports = mongoose.model("Medication", MedicationSchema);