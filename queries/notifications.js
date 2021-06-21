let AdminNotificationModel = require('../models/adminNotification/AdminNotification');
let val = require('./helpers/helper');
let { getCurrentTime } = require('../config/rootHelpers');

function findById(id,callback){
  AdminNotificationModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function findAll(callback){
  AdminNotificationModel.find({}).populate('medicationMissed.dependent')
  .populate('medicationMissed.group').populate('medicationMissed.rxsMedication')
  .sort({dateCreated:-1}).exec(function(err,notificationsFound){
    if(err){
      callback(err);
    }else{
      callback(null,notificationsFound);
    }
  });
}

function patchUpdateById(body,id,callback){
    AdminNotificationModel.findById(id,function(err,foundDoc){
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
  var AdminNotificationDate = oldDoc.AdminNotificationDate;

  if(updatedFields.name){
    name = updatedFields.name;
  }
  if(updatedFields.message){
    message = updatedFields.message;
  }
  if(updatedFields.AdminNotificationDate){
    AdminNotificationDate = updatedFields.AdminNotificationDate;
  }
  var obj = {
    name:name,
    message:message,
    AdminNotificationDate:AdminNotificationDate
  }
  return obj;
}


function deleteById(id,callback){
  AdminNotificationModel.findOneAndDelete({_id:id},function(err,deletedDoc){
    if(err){
      callback(err);
    }else{
      callback(null,deletedDoc);
    }
  });
}
function saveToDoc(bodyData,schemaModel,callback){
  var newDoc = new schemaModel({
    dateCreated: getCurrentTime().format(),
    type:bodyData.type
  });
  if(typeof(bodyData.medicationMissed)!='undefined'){
    newDoc.medicationMissed = bodyData.medicationMissed
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
  val.validator(AdminNotificationModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      saveToDoc(body,AdminNotificationModel,function(err,result){
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
