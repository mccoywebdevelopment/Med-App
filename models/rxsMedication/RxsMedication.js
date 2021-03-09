var mongoose = require("mongoose");

var RxsMedicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reason: { type: String, required: true },
    datePrescribed: { type: String, required: true },
    instructions: String,
    endDate: String,

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