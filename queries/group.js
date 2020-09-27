const groupModel = require('../models/group/Group');
const dependentModel = require('../models/dependent/Dependent');
const guardianModel = require('../models/guardian/Guardian');
const val = require('./helpers/helper');

function findById(id,callback){
  groupModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else if(!result){
      callback("No group found.");
    }else{
      callback(null,result);
    }
  });
}
function findAll(callback){
  groupModel.find({}).populate('dependents').populate('guardians').exec(function(err,dependentFound){
    if(err){
      callback(err);
    }else{
      callback(null,dependentFound);
    }
  });
}

function patchUpdateById(body,id,callback){
  if(!body.updatedFields){
    callback("body.updatedFields is not defined");
  }else{
    groupModel.findById(id,function(err,foundDoc){
      if(err){
        callback(err);
      }else if(!foundDoc){
        callback("Document not found."); 
      }else{
        updateModifiedFields(foundDoc,body.updatedFields,function(err,newDoc){
          if(err){
            callback(err);
          }else{
            foundDoc.update(newDoc,function(err,result){
              if(err){
                callback(err);
              }else{
                callback(null,result);
              }
            });
          }
        });
      }
    });
  }
}
function updateWithList(oldDoc,updatedFields,callback){
  if(updatedFields.dependents){
    oldDoc.dependents = updatedFields.dependents;
  }
  if(updatedFields.guardians){
    oldDoc.guardians = updatedFields.guardians;
  }
  callback(null,oldDoc);

}
function updateModifiedFields(oldDoc,updatedFields,callback){
  console.log("==========================START==================================");
  console.log(updatedFields)
  console.log(oldDoc.name);
  console.log("===========================END===================================")
  var groupname = oldDoc.name;
  var dependents = oldDoc.dependents;
  var guardians = oldDoc.guardians;
  var pictureUrl = oldDoc.pictureUrl;
 
  if(updatedFields.pictureUrl){
    pictureUrl = updatedFields.pictureUrl;
  }
  if(updatedFields.name){
    groupname = updatedFields.name;
  }
  
  var obj ={
    name:groupname,
    pictureUrl:pictureUrl,
    dependents:dependents,
    guardians:guardians
  };
  if(updatedFields.dependents || updatedFields.guardians){
    updateWithList(obj,updatedFields,function(err,newDoc){
      if(err){
        callback(err);
      }else{
        callback(null,newDoc);
      }
    });
  }else{
    if(updatedFields.dependent){
      addDependentToGroup(obj,updatedFields.dependent,function(err,newDoc){
        if(err){
          callback(err);
        }else{
          if(updatedFields.guardian){
            addGuardianToGroup(obj,updatedFields.guardian,function(err,newDoc){
              if(err){
                callback(err);
              }else{
                callback(null,newDoc);
              }
            });
          }else{
           callback(null,newDoc);
          }
        }
      });
    }else if(updatedFields.guardian){
      addGuardianToGroup(obj,updatedFields.guardian,function(err,newDoc){
        if(err){
          callback(err);
        }else{
          callback(null,newDoc);
        }
      });
    }else{
      callback(null,obj);
    }
  }

}
function addDependentToGroup(newDoc,dependentId,callback){
  dependentModel.findById(dependentId,function(err,result){
    if(err){
      callback(err);
    }else if(!result){
      callback("Dependent not found.");
    }else{
      newDoc.dependents.push(result);
      callback(null,newDoc);
    }
  });
}

function addGuardianToGroup(newDoc,guardianId,callback){
  guardianModel.findById(guardianId,function(err,result){
    if(err){
      callback(err);
    }else if(!result){
      callback("Guardian not found.");
    }else{
      newDoc.guardians.push(result);
      callback(null,newDoc);
    }
  });
}

function deleteById(id,callback){
  groupModel.findOneAndDelete({_id:id},function(err,deletedDoc){
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
  if(typeof(bodyData.dependent)!='undefined'){
    addDependentToGroup(newDoc,bodyData.dependent,function(err,newDoc){
      if(err){
        callback(err);
      }else if(bodyData.guardian){
        addGuardianToGroup(newDoc,bodyData.guardian,function(err,newDoc){
          if(err){
            callback(err);
          }else{
            newDoc.save(function(err,result){
              if(err){
                callback(err);
              }else{
                callback(null,result);
              }
            });
          }
        });
      }else if(typeof(bodyData.guardian)!='undefined'){
        addGuardianToGroup(newDoc,bodyData.guardian,function(err,newDoc){
          if(err){
            callback(err);
          }else{
            newDoc.save(function(err,result){
              if(err){
                callback(err);
              }else{
                callback(null,result);
              }
            });
          }
        });
      }else{
        newDoc.save(function(err,result){
          if(err){
            callback(err);
          }else{
            callback(null,result);
          }
        });
      }
    });
  }else{
    newDoc.save(function(err,result){
      if(err){
        callback(err);
      }else{
        callback(null,result);
      }
    });
  }
}

function create(body,callback){
  val.validator(groupModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      saveToDoc(body,groupModel,function(err,result){
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
