var mongoose = require("mongoose");

var RxsMedicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reason: { type: String, required: true },
    datePrescribed: { type: String, required: true },
    base64:{type: String, required: true},
    refID:{type:String, required: true, unique: true, select: false},
    instructions: String,
    endDate: String,
    rxsNumber:Number,
    doctorContacts:{
        name:{
            firstName:{type:String,required:true},
            lastName:{type:String,required:true}
        },
        phoneNumber:{type:String,required:true}
    },
    dosage: {
        quantity: { type: Number, required: true },
        unit: { type: String, required: true }
    },
    whenToTake: [
        {type:String}
    ],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicationEvent"
    }]
});


module.exports = mongoose.model("RxsMedication", RxsMedicationSchema);