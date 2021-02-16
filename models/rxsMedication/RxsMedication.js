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
        {
            title: { type: String, default: "morning" },
            value: { type: Boolean, default: false },
            time: [
                { type: String, default: "4:00 am" },
                { type: String, default: "11:59 pm" }]
        },
        {
            title: { type: String, default: "afternoon" },
            value: { type: Boolean, default: false },
            time: [{
                type: String,
                default: "12:00 pm"
            },
            {
                type: String,
                default: "5:59 pm"
            }]
        },
        {
            title: { type: String, default: "evening" },
            value: { type: Boolean, default: false },
            time: [{
                type: String,
                default: "6:00 pm"
            },
            {
                type: String,
                default: "11:59 pm"
            }]
        }
    ],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicationEvent"
    }]
});


module.exports = mongoose.model("RxsMedication", RxsMedicationSchema);