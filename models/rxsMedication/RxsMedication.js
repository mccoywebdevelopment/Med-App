var mongoose = require("mongoose");

var RxsMedicationSchema = new mongoose.Schema({
    name:{type:String,required:true},
    reason:{type:String,required:true},
    datePrescribed:{type:String,required:true},
    instructions:String,
    endDate:String,

    dosage:{
        quantity:{type:Number,required:true},
        unit:{type:String,required:true}
    },
    
    whenToTake:{
        value:{type:String,default:null},
        from:{type:String,default:null},
        to:{type:String,default:null},
    },

    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicationEvent"
    }]
});

RxsMedicationSchema.pre('save',function(next){
    if(this.whenToTake.value == "morning"){
        this.whenToTake.from = "05:00am";
        this.whenToTake.to = "12:00pm";
    }else if(this.whenToTake.value == "afternoon"){
        this.whenToTake.from = "12:01pm";
        this.whenToTake.to = "5:00pm";
    }else if(this.whenToTake.value == "evening"){
        this.whenToTake.from = "05:01pm";
        this.whenToTake.to = "08:00pm";
    }else{
        this.whenToTake.value = null;
        this.whenToTake.from = null;
        this.whenToTake.to = null;
    }
    next();
});

RxsMedicationSchema.pre('update',function(next){
    if(this._update.whenToTake.value == "morning"){
        this._update.whenToTake.from = "05:00am";
        this._update.whenToTake.to = "12:00pm";
    }else if(this._update.whenToTake.value == "afternoon"){
        this._update.whenToTake.from = "12:01pm";
        this._update.whenToTake.to = "5:00pm";
    }else if(this._update.whenToTake.value == "evening"){
        this._update.whenToTake.from = "05:01pm";
        this._update.whenToTake.to = "08:00pm";
    }else{
        this._update.whenToTake.value = null;
        this._update.whenToTake.from = null;
        this._update.whenToTake.to = null;
    }
    next();
});

module.exports = mongoose.model("RxsMedication", RxsMedicationSchema);