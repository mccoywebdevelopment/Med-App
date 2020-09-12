const RxsMedModel = require('../models/rxsMedication/RxsMedication');
const val = require('./helpers/helper');
const delMedEvent = require('./medicationEvent').deleteById;

function findAll(callback){
  RxsMedModel.find({},function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function findById(id,callback){
  RxsMedModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function patchUpdateById(body,id,callback){
  if(!body.updatedFields){
    callback("body.updatedFields is not defined");
  }else{
    RxsMedModel.findById(id,function(err,foundDoc){
      if(err){
        callback(err);
      }else{
        var obj = updateModifiedFields(foundDoc,body.updatedFields);
        foundDoc.update(obj,function(err,result){
          if(err){
            callback(err);
          }else{
            callback(null,obj);
          }
        });
      }
    });
  }
}
function updateModifiedFields(oldDoc,updatedFields){
  var name = oldDoc.name;
  var dosage = oldDoc.dosage;
  var reason = oldDoc.reason;
  var datePrescribed = oldDoc.datePrescribed;
  var instructions = oldDoc.instructions;
  var endDate = oldDoc.endDate;
  var whenToTake = oldDoc.whenToTake;
  var events = oldDoc.events;

  if(updatedFields.name){
    name = updatedFields.name;
  }
  if(updatedFields.quantity){
    dosage.quantity = updatedFields.quantity;
  }
  if(updatedFields.unit){
    dosage.unit = updatedFields.unit;
  }
  if(updatedFields.reason){
    reason = updatedFields.reason;
  }
  if(updatedFields.datePrescribed){
    datePrescribed = updatedFields.datePrescribed;
  }
  if(updatedFields.instructions){
    instructions = updatedFields.instructions;
  }
  if(updatedFields.endDate){
    endDate = updatedFields.endDate;
  }
  if(updatedFields.event){
    callback("EVENT NOT IMPLEMENTED");
  }
  if(updatedFields.value){
    whenToTake.value = updatedFields.value;
  }


  var obj = {
    name:name,
    dosage:dosage,
    reason:reason,
    datePrescribed:datePrescribed,
    instructions:instructions,
    endDate:endDate,
    whenToTake:whenToTake,
    events:events
  }
  return obj;
}

function deleteById(id,callback){
  RxsMedModel.findOneAndDelete({_id:id}).populate('events').exec(function(err,deletedDoc){
    if(err){
      callback(err);
    }else if(!deletedDoc){
      callback("Doc not found.");
    }else{
      deleteAllRxsMedEvents(deletedDoc.events,function(err,res){
        if(err){
          callback(err);
        }else{
          callback(null,res);
        }
      });
    }
  });
}
function deleteAllRxsMedEvents(rxsMeds,callback){
  if(rxsMeds.length<1){
    callback(null,"None");
    return;
  }
  var i = 0;
  var error = false;
  rxsMeds.forEach(element => {
    delMedEvent(element._id.toString(),function(err,deletedDoc){
      if(err){
        callback(error);
        return;
      }else if(i==rxsMeds.length-1){
        callback(null,"All deleted");
        return;
      }
      i++;
    });
  });
}

function saveToDoc(bodyData,schemaModel,callback){
  console.log(bodyData);
  //Later maybe make this generic
  var newDoc = new schemaModel({
      name:bodyData.name,
      dosage:{
        quantity:bodyData.quantity,
        unit:bodyData.unit
      },
      reason:bodyData.reason,
      datePrescribed:bodyData.datePrescribed
  });

  if(typeof(bodyData.instructions)!='undefined'){
    newDoc.instructions = bodyData.instructions
  }
  if(typeof(bodyData.endDate)!='undefined'){
    newDoc.endDate = bodyData.endDate;
  }
  if(typeof(bodyData.value)!='undefined'){
    newDoc.whenToTake.value = bodyData.value;
  }
  if(typeof(bodyData.events)!='undefined'){
    callback("Create events function still needs to be created");
    //create Events
  }

  newDoc.save(function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });

}

function create(body,callback){
  val.validator(RxsMedModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      saveToDoc(body,RxsMedModel,function(err,result){
        if(err){
          callback(err);
        }else{
          callback(null,result);
        }
      });
    }
  });
}


module.exports={findAll,findById,patchUpdateById,deleteById,create}