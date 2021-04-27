let MedModel = require('../models/medication/Medication');
let val = require('./helpers/helper');

function findAll(callback){
  MedModel.find({},function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function findById(id,callback){
  MedModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function patchUpdateById(body,id,callback){
    MedModel.findById(id,function(err,foundDoc){
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
  //var events = oldDoc.events;

  if(updatedFields.name){
    name = updatedFields.name;
  }
  if(updatedFields.events){
   // events.push(updatedFields.events);
  }
  var obj = {
    name:name,
    //events:events
  }
  return obj;
}

function deleteById(id,callback){
  MedModel.findOneAndDelete({_id:id},function(err,deletedDoc){
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
  });

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
  val.validator(MedModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      saveToDoc(body,MedModel,function(err,result){
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