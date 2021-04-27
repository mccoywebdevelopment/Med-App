let eventModel = require('../models/event/Event');
let medicationEventModel = require('../models/medicationEvent/MedicationEvent');
let val = require('./helpers/helper');

function findById(id,callback){
  eventModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function findAll(callback){
  eventModel.find({},function(err,dependentFound){
    if(err){
      callback(err);
    }else{
      callback(null,dependentFound);
    }
  });
}

function patchUpdateById(body,id,callback){
    eventModel.findById(id,function(err,foundDoc){
      if(err){
        callback(err);
      }else{
        var obj = updateModifiedFields(foundDoc,body);
        foundDoc.update(obj,function(err,result){
          if(err){
            callback(err);
          }else{
            callback(null,result);
          }
        });
      }
    });
  }

function updateModifiedFields(oldDoc,updatedFields){
  var name = oldDoc.name;
  var message = oldDoc.message;
  var eventDate = oldDoc.eventDate;

  if(updatedFields.name){
    name = updatedFields.name;
  }
  if(updatedFields.message){
    message = updatedFields.message;
  }
  if(updatedFields.eventDate){
    eventDate = updatedFields.eventDate;
  }
  var obj = {
    name:name,
    message:message,
    eventDate:eventDate
  }
  return obj;
}


function deleteById(id,callback){
  eventModel.findOneAndDelete({_id:id},function(err,deletedDoc){
    if(err){
      callback(err);
    }else{
      callback(null,deletedDoc);
    }
  });
}
function saveToDoc(bodyData,schemaModel,callback){
  //Later maybe make this generic
  var newDoc = new schemaModel({
    name:bodyData.name,
    message:bodyData.message,
  });
  if(typeof(bodyData.eventDate)!='undefined'){
    newDoc.timeStamp = bodyData.timeStamp;
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
  val.validator(eventModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      saveToDoc(body,eventModel,function(err,result){
        if(err){
          callback(err);
        }else{
          callback(null,result);
        }
      });
    }
  });
}


module.exports = {create,findAll,deleteById,findById,patchUpdateById};
