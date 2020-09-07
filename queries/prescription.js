const rxsModel = require('../models/rxs/Rxs');
const val = require('./helpers/helper');
const createRxsMedication = require('./rxsMedication').create;
const RxsMedication = require('../models/rxsMedication/RxsMedication');
const rxsMedDel = require('./rxsMedication').deleteById;

function findById(id,callback){
  rxsModel.findById(id,function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  });
}
function findAll(callback){
  rxsModel.find({},function(err,dependentFound){
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
    rxsModel.findById(id,function(err,foundDoc){
      if(err){
        callback(err);
      }else{
        updateModifiedFields(foundDoc,body.updatedFields,function(err,obj){
          if(err){
            callback(err);
          }else{
            rxsModel.findByIdAndUpdate(id,obj,function(err,result){
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

function updateModifiedFields(oldDoc,updatedFields,callback){
  var firstName = oldDoc.doctorContacts.name.firstName;
  var lastName = oldDoc.doctorContacts.name.lastName;
  var phoneNumber = oldDoc.doctorContacts.phoneNumber;
  var rxsNumber = oldDoc.rxsNumber;
  // var _id = oldDoc._id;
  var rxsMedications = oldDoc.rxsMedications;

  if(updatedFields.firstName){
    firstName = updatedFields.firstName;
  }
  if(updatedFields.lastName){
    lastName = updatedFields.lastName;
  }
  if(updatedFields.phoneNumber){
    phoneNumber = updatedFields.phoneNumber;
  }
  if(updatedFields.rxsNumber){
    rxsNumber = updatedFields.rxsNumber;
  }
  var obj = {
    // _id:_id,
    doctorContacts:{
      name:{
        firstName:firstName,
        lastName:lastName
      },
      phoneNumber:phoneNumber
    },
    rxsNumber:rxsNumber,
    // rxsMedications:rxsMedications
  }

  // if(updatedFields.rxsMedication){
  //   createRxsMedicationAndAttatch(obj,updatedFields.rxsMedication,function(err,obj){
  //     if(err){
  //       callback(err);
  //     }else{
  //       callback(null,obj);
  //     }
  //   });
  // }else{
  //   callback(null,obj);
  // }
  callback(null,obj)

}

function createRxsMedicationAndAttatch(obj,rxsMedication,callback){
  // createRxsMedication(rxsMedication,function(err,result){
  //   if(err){
  //     callback(err);
  //   }else{
  //     obj.rxsMedications.push(result);
  //     callback(null,obj);
  //   }
  // });
  if(rxsMedication.length<1){
    callback(null,obj);
  }
  if(Array.isArray(rxsMedication)){
    var i = 0;

    rxsMedication.forEach(element=>{
      createRxsMedication(element,function(err,rxsMedicationCreated){
        obj.rxsMedications.push(rxsMedicationCreated);
        if(err){
          callback(err);
          return;
        }else if(i == rxsMedication.length-1){
          callback(null,obj);
          return;
        }
        i++;
      });
    });
  }else{
    createRxsMedication(rxsMedication,function(err,rxsMedicationCreated){
      if(err){
        callback(err);
      }else{
        obj.rxsMedications.push(rxsMedicationCreated);
        callback(null,obj);
      }
    });
  } 
}
function deleteAllRxsMeds(rxsMeds,callback){
  if(rxsMeds.length<1){
    callback(null,"None");
    return;
  }
  var i = 0;
  var error = false;
  rxsMeds.forEach(element => {
    rxsMedDel(element._id.toString(),function(err,deletedDoc){
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
function deleteById(id,callback){
  rxsModel.findOneAndDelete({_id:id}).populate('rxsMedications').exec(function(err,rxsFound){
    if(err){
      callback(err);
    }else if(!rxsFound){
      callback("Rxs not found.");
    }else{
      deleteAllRxsMeds(rxsFound.rxsMedications,function(err,result){
        if(err){
          callback(err);
        }else{
          callback(null,result);
        }
      });
    }
  });
}
function saveToDoc(bodyData,schemaModel,callback){
  //Later maybe make this generic
  var newDoc = new schemaModel({
    doctorContacts:{
      name:{
        firstName:bodyData.firstName,
        lastName:bodyData.lastName
      },
      phoneNumber:bodyData.phoneNumber,
    },
    rxsNumber:bodyData.rxsNumber,
  });

  if(typeof(bodyData.rxsMedication)!='undefined'){
    createRxsMedicationAndAttatch(newDoc,bodyData.rxsMedication,function(err,newDoc){
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

}

function create(body,callback){
  val.validator(rxsModel,body,function(err,result){
    if(err){
      callback(err);
    }else{
      saveToDoc(body,rxsModel,function(err,result){
        if(err){
          callback(err);
        }else{
          callback(null,result);
        }
      });
    }
  });


}

function removeRxsMedicationFromRxs(rxsId,medId,callback){
    RxsMedication.findByIdAndDelete(medId,function(err,result){
      if(err){
        callback(err);
      }else if(!result){
        callback("Rxs medication not found");
      }else{
        callback(null,result);
      }
    });
}


module.exports = {create,findAll,deleteById,findById,patchUpdateById,removeRxsMedicationFromRxs};