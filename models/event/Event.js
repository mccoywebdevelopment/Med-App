var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema({
    name:{type:String,required:true},
    message:{type:String,required:true},
    timeStamp:Date
});

EventSchema.pre('save',function(next){
    this.timeStamp = Date.now();
    next();
});


module.exports = mongoose.model("Event", EventSchema);