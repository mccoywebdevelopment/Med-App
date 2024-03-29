let guardianModel = require('../models/guardian/Guardian');
let userPatch = require('./user').patchUpdateById;
let userModel = require('../models/user/User');
let userCreate = require('./user').create;
let val = require('./helpers/helper');

function findById(id,callback){
  guardianModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function findAll(callback){
  guardianModel.find({},function(err,dependentFound){
    if(err){
      callback(err);
    }else{
      callback(null,dependentFound);
    }
  });
}

function patchUpdateById(body,id,callback){
    guardianModel.findById(id,function(err,foundDoc){
      if(err){
        callback(err);
      }else if(!foundDoc){
        callback("Guardian not found.")
      }else{
        updateModifiedFields(foundDoc,body.updatedFields,function(err,newDoc){
          if(err){
            callback(err);
          }else{
            foundDoc.update(newDoc,function(err,result){
              if(err){
                callback(err);
              }else{
                callback(null,newDoc);
              }
            });
          }
        });
      }
    });
  
}

function updateModifiedFields(oldDoc,updatedFields,callback){
  var user = oldDoc.user;
  var firstName = oldDoc.name.firstName;
  var lastName = oldDoc.name.lastName;
  var phoneNumber = oldDoc.phoneNumber;
  var pictureUrl = oldDoc.pictureUrl;
 
  if(updatedFields.pictureUrl){
    pictureUrl = updatedFields.pictureUrl;
  }
  if(updatedFields.firstName){
    firstName = updatedFields.firstName;
  }
  if(updatedFields.lastName){
    lastName = updatedFields.lastName;
  }
  if(updatedFields.phoneNumber){
    phoneNumber = updatedFields.phoneNumber;
  }
  if(updatedFields.pictureUrl){
    pictureUrl = updatedFields.pictureUrl;
  }
  let obj = {
    user:user,
    name:{
      firstName:firstName,
      lastName:lastName
    },
    phoneNumber:phoneNumber,
    pictureUrl:pictureUrl
  };
  if(updatedFields.user){
    userPatch(updatedFields.user,oldDoc.user._id.toString(),function(err,updatedUser){
      if(err){
        callback(err);
      }else{
        obj.user = updatedUser;
        callback(null,obj);
      }
    });
  }else{
    callback(null,obj);
  }

  
}

function deleteById(id,callback){
  guardianModel.findOneAndDelete({_id:id},function(err,deletedDoc){
    if(err){
      callback(err);
    }else{
      callback(null,deletedDoc);
    }
  });
}
function saveToDoc(bodyData,callback){
  //Later maybe make this generic
  let newDoc = new guardianModel();
  if(bodyData.firstName){
    newDoc.name.firstName = bodyData.firstName;
  }
  if(bodyData.lastName){
    newDoc.name.lastName = bodyData.lastName;
  }
  if(bodyData.phoneNumber){
    newDoc.phoneNumber = bodyData.phoneNumber;
  }
  if(typeof(bodyData.pictureUrl)!='undefined'){
    newDoc.pictureUrl = bodyData.pictureUrl;
  }

    userModel.findById(bodyData.user,function(err,userFound){
      if(err){
        callback(err);
      }else if(!userFound){
        callback("User not found")
      }else{
        newDoc.user = userFound;
    
        newDoc.save(function(err,result){
          if(err){
            callback(err);
          }else{
            callback(null,result);
          }
        });
      }
    });
  
  
}

function create(body,callback){
  val.validator(guardianModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      saveToDoc(body,function(err,result){
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
