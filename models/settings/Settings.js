var mongoose = require("mongoose");

var SettingsSchema = new mongoose.Schema({
    morning:{
        start:{type:String,default:"04:00 AM"},
        end:{type:String,default:"11:59 AM"}
    },
    afternoon:{
        start:{type:String,default:"12:00 PM"},
        end:{type:String,default:"05:59 PM"}
    },
    evening:{
        start:{type:String,default:"06:00 PM"},
        end:{type:String,default:"10:00 PM"}
    }
});


module.exports = mongoose.model("Settings", SettingsSchema);