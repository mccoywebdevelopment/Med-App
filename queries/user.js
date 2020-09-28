const userModel = require('../models/user/User');
const val = require('./helpers/helper');
const Guardian = require('../models/guardian/Guardian');
const Group = require('../models/group/Group');
const RxsMedication = require('../models/rxsMedication/RxsMedication');
const Rxs = require('../models/rxs/Rxs');
const Medication = require('../models/medication/Medication');

function getDependents(jwt,callback){
  userModel.findOne({"auth.token":jwt},function(err,userFound){
    if(err){
        callback(err);
    }else if(!userFound){
        callback("User not found.");
    }else{
       Guardian.findOne({user:userFound._id},function(err,guardianFound){
          if(err){
            callback(err);
          }else if(!guardianFound){
            callback("Guardian not found.");
          }else{
            Group.find({guardians:guardianFound._id}).populate('guardians').populate('dependents').exec(function(err,groupsFound){
              if(err){
                callback(err);
              }else if(!groupsFound){
                callback("No groups listed");
              }else{
                Rxs.populate(groupsFound,{path:"dependents.rxs"},function(err,res){
                  if(err){
                     callback(err);
                  }else{
                    RxsMedication.populate(res,{path:"dependents.rxs.rxsMedications"},function(err,res){
                      if(err){
                        callback(err);
                      }else{
                        Medication.populate(res,{path:"dependents.medications"},function(err,res){
                          if(err){
                            callback(err);
                          }else{
                            var dependents = [];
                            for(var i=0;i<res.length;++i){
                              var curGroup = res[i];
                              for(var ix=0;ix<curGroup.dependents.length;++ix){
                                dependents.push(curGroup.dependents[ix]);
                              }
                            }
                            var obj = {
                              dependents:dependents
                            }
                            callback(null,obj);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
    }
});
}
function findById(id,callback){
  userModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function findAll(callback){
  userModel.find({},function(err,dependentFound){
    if(err){
      callback(err);
    }else{
      callback(null,dependentFound);
    }
  });
}
function findExceptMe(jwt,callback){
  userModel.find({},function(err,dependentFound){
    if(err){
      callback(err);
    }else{
      var arr = [];
      for(var i=0;i<dependentFound.length;++i){
        if(jwt!=dependentFound[i].auth.token){
          arr.push(dependentFound[i]);
        }
      }
      callback(null,arr);
    }
  });
}

function patchUpdateById(body,id,callback){
    userModel.findById(id,function(err,foundDoc){
      if(err){
        callback(err);
      }else{
        var obj = updateModifiedFields(foundDoc,body);
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

function updateModifiedFields(oldDoc,updatedFields){
  var username = oldDoc.username;
  var password = oldDoc.password;
  var isAdmin = oldDoc.isAdmin;

  if(updatedFields.userName){
    username = updatedFields.username;
  }
  if(typeof(updatedFields.isAdmin)!=undefined){
    isAdmin = updatedFields.isAdmin;
  }
  var obj = {
    username:username,
    password:password,
    isAdmin:isAdmin
  }
  return obj;
}


function deleteById(id,callback){
  userModel.findOneAndDelete({_id:id},function(err,deletedDoc){
    if(err){
      callback(err);
    }else{
      Guardian.find({user:id}).remove().exec(function(err,guardianDeleted){
        if(err){
          callback(err);
        }else{
          callback(null,deletedDoc);
        }
      });
    }
  });
}
function saveToDoc(bodyData,schemaModel,callback){
  //Later maybe make this generic
  var newDoc = new schemaModel({
    username:bodyData.username,
  });
  if(typeof(bodyData.password)!='undefined'){
    newDoc.password = bodyData.password;
  }
  if(typeof(bodyData.isAdmin)!='undefined'){
   if(typeof(bodyData.isAdmin)=='string'){
     if(bodyData.isAdmin.toLowerCase() == 'true'){
       bodyData.isAdmin = true;
     }else{
       bodyData.isAdmin = false;
     }
   }
   newDoc.isAdmin = bodyData.isAdmin;
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
  val.validator(userModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      userModel.findOne({username:body.username},function(err,userFound){
        if(err){
          callback(err);
        }else if(userFound){
          callback("User with that email/username already exists.");
        }else{
          saveToDoc(body,userModel,function(err,result){
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

function createFirstUser(secretKey,email,password,callback){
  userModel.find({},function(err,result){
    if(err){
      callback(err);
    }else if(result.length>0){
      callback("User already created");
    }else if(secretKey!="serendipity"){
      callback("Invalid Key");
    }else{
      var body = {
        username:email,
        password:password,
        isAdmin:true
      }
      create(body,function(err,result){
        if(err){
          callback(err);
        }else{
          callback(null,result);
        }
      });
    }
  });
}


module.exports = {create,findAll,findExceptMe,deleteById,findById,patchUpdateById,getDependents,createFirstUser};
