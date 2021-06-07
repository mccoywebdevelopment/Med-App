var mongoose = require("mongoose");
let getCurrentTime = require('../../config/rootHelpers').getCurrentTime

var DependentSchema = new mongoose.Schema({
    name:{
        firstName:{type:String,required:true,min:3},
        lastName:{type:String,required:true}
    },
    dateOfBirth:{type:String,required:true},
    rxsMedications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RxsMedication'
    }],
    pictureUrl:String,
    dateCreated:Date

});

DependentSchema.pre('save',function(next){
    this.dateCreated = getCurrentTime();
    if(this.name.firstName.length<3){
        next("Server Error: First Name must be at least 3 characters.");
    }else if(this.name.lastName.length<3){
        next("Server Error: Last Name must be at least 3 characters.");
    }else{
        next(); 
    }
});

DependentSchema.pre('update',function(next){
    if(this._update.name.firstName.length<3){
        next("Server Error: First Name must be at least 3 characters.");
    }else if(this._update.name.lastName.length<3){
        next("Server Error: Last Name must be at least 3 characters.");
    }else{
        next();
    }
});

module.exports = mongoose.model("Dependent", DependentSchema);