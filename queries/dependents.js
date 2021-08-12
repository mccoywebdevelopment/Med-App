let dependentModel = require('../models/dependent/Dependent');
let val = require('./helpers/helper');
let createRxsMedication = require('./rxsMedication').create;
let updateRxsMedication = require('./rxsMedication').patchUpdateById;
let rxsMedicationDelete = require('./rxsMedication').deleteById;

function findDependentById(id, callback) {
  dependentModel.findById(id, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback("Doc not found.");
    } else {
      callback(null, result);
    }
  });
}
function findDependents(callback) {
  dependentModel.find({}, function (err, dependentFound) {
    if (err) {
      callback(err);
    } else {
      callback(null, dependentFound);
    }
  });
}
function patchUpdateDependentById(body, id, callback) {
    dependentModel.findById(id, function (err, foundDoc) {
      if (err) {
        callback(err);
      } else {
        updateModifiedFields(foundDoc, body, function (err, obj) {
          if (err) {
            callback(err);
          } else {
            foundDoc.update(obj, function (err, result) {
              if (err) {
                callback(err);
              } else {
                callback(null, obj);
              }
            });
          }
        });
      }
    });
  }


function updateModifiedFields(oldDoc, updatedFields, callback) {

  var firstName = oldDoc.name.firstName;
  var lastName = oldDoc.name.lastName;
  var dateOfBirth = oldDoc.dateOfBirth;
  var dateOfPlacement = oldDoc.dateOfPlacement
  var pictureUrl = oldDoc.pictureUrl;
  var rxsMedications = oldDoc.rxsMedications;

  if (updatedFields.firstName) {
    firstName = updatedFields.firstName;
  }
  if (updatedFields.lastName) {
    lastName = updatedFields.lastName;
  }
  if (updatedFields.dateOfBirth) {
    dateOfBirth = updatedFields.dateOfBirth;
  }
  if (updatedFields.dateOfPlacement) {
    dateOfPlacement = updatedFields.dateOfPlacement;
  }
  if (updatedFields.pictureUrl) {
    pictureUrl = updatedFields.pictureUrl;
  }
  var obj = {
    name: {
      firstName: firstName,
      lastName: lastName
    },
    dateOfBirth: dateOfBirth,
    dateOfPlacement: dateOfPlacement,
    pictureUrl: pictureUrl,
    rxsMedications: rxsMedications,
  }
  if(updatedFields.rxsMedications){
    getRxsMedication(updatedFields,function(err,rxsMedications){
      if(err){
        callback(err)
      }else{
        obj.rxsMedications = rxsMedications;
        callback(null,obj);
      }
    });
  }else{
    callback(null,obj);
  }
}

function getRxsMedication(dep,callback){
  let i = 0;
  let rxsMedicationArr = [];
  if(!dep.rxsMedications || dep.rxsMedications.length<1){
    callback(null,[]);
    return;
  }
  dep.rxsMedications.forEach(rxsMedication => {
  if(rxsMedication._id){
      //update rxsMedication
      updateRxsMedication(rxsMedication,rxsMedication._id,function(err,rxsMedicationUpdated){
        i++;
        if(err){
          console.log(err);
        }else{
          rxsMedicationArr.push(rxsMedicationUpdated);
        }
        if(i == dep.rxsMedications.length){
          callback(null,rxsMedicationArr);
          return;
        }
      });
    }else{
      createRxsMedication(rxsMedication,function(err,rxsMedicationCreated){
        i++;
        if(err){
          console.log(err);
        }else{
          rxsMedicationArr.push(rxsMedicationCreated);
        }
        if(i == dep.rxsMedications.length){
          callback(null,rxsMedicationArr);
          return;
        }
      });
    }

  });
}
function deleteAllRxsMedication(rxsMedications, callback) {
  if (rxsMedications.length < 1) {
    callback(null, "None");
    return;
  }
  var i = 0;
  var error = false;
  rxsMedications.forEach(element => {
    rxsMedicationDelete(element._id.toString(), function (err, deletedDoc) {
      if (err) {
        callback(error);
        return;
      } else if (i == rxsMedications.length - 1) {
        callback(null, "All deleted");
        return;
      }
      i++;
    });
  });
}
function deleteDependentById(id, callback) {
  dependentModel.findOneAndDelete({ _id: id }).populate('rxsMedications').exec(function (err, dependentFound) {
    if (err) {
      callback(err);
    } else if (!dependentFound) {
      callback("Dependent not found.");
    } else {
      deleteAllRxsMedication(dependentFound.rxsMedications, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null,dependentFound);
        }
      });
    }
  });

}

function saveToDoc(bodyData, schemaModel, callback) {
  //Later maybe make this generic
  var newDoc = new schemaModel({
    name: {
      firstName: bodyData.firstName,
      lastName: bodyData.lastName
    },
    dateOfBirth: bodyData.dateOfBirth
  });
  if (typeof (bodyData.pictureUrl) != 'undefined') {
    newDoc.pictureUrl = bodyData.pictureUrl;
  }
  if(typeof (bodyData.dateOfPlacement) != 'undefined'){
    newDoc.dateOfPlacement = bodyData.dateOfPlacement;
  }


  if (typeof (bodyData.rxsMedications) != 'undefined') {
    getRxsMedication(bodyData,function (err, rxsMedications) {
      if (err) {
        callback(err);
      }else{
        newDoc.rxsMedications = rxsMedications;
        newDoc.save(function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      }
    });
  } else {
    newDoc.save(function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  }
}

function createDependent(body, callback) {
  val.validator(dependentModel, body, function (err, result) {
    if (err) {
      callback(err);
    } else {
      saveToDoc(body, dependentModel, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
}


function getDependentsWithMeds(callback) {
    dependentModel.find({}).populate('rxsMedications').exec(function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null,result);
      }
    });
}




module.exports = { findDependentById, findDependents, createDependent, deleteDependentById, patchUpdateDependentById, getDependentsWithMeds };