var mongoose = require("mongoose");

var GroupSchema = new mongoose.Schema({
    name:{type:String,required:true},
    pictureUrl:String,
    dependents:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dependent'
    }],
    guardians:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guardian'
    }]
});

module.exports = mongoose.model("Group", GroupSchema);