const dependentModel = require('../models/dependent/Dependent');
const val = require('./helpers/helper');
const createRxs = require('./prescription').create;
const updateRxs = require('./prescription').patchUpdateById;
const createMedication = require('./medication').create;
const rxsMedicationModel = require('../models/rxsMedication/RxsMedication');
const Medication = require('../models/medication/Medication');
const rxsDelete = require('./prescription').deleteById;
const medDelete = require('./medication').deleteById;

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
  if (!body.updatedFields) {
    callback("body.updatedFields is not defined");
  } else {
    dependentModel.findById(id, function (err, foundDoc) {
      if (err) {
        callback(err);
      } else {
        updateModifiedFields(foundDoc, body.updatedFields, function (err, obj) {
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
}

function updateModifiedFields(oldDoc, updatedFields, callback) {
  var firstName = oldDoc.name.firstName;
  var lastName = oldDoc.name.lastName;
  var dateOfBirth = oldDoc.dateOfBirth;
  var pictureUrl = oldDoc.pictureUrl;
  var rxs = oldDoc.rxs;
  var medications = oldDoc.medications;

  if (updatedFields.firstName) {
    firstName = updatedFields.firstName;
  }
  if (updatedFields.lastName) {
    lastName = updatedFields.lastName;
  }
  if (updatedFields.dateOfBirth) {
    dateOfBirth = updatedFields.dateOfBirth;
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
    pictureUrl: pictureUrl,
    rxs: rxs,
    medications: medications
  }
  if(updatedFields.rxs){
    getRxs(updatedFields,function(err,rxs){
      if(err){
        callback(err)
      }else{
        obj.rxs = rxs;
        callback(null,obj);
      }
    });
  }else{
    callback(null,obj);
  }

  // if (updatedFields.rxs) {
  //   createRxsAndAttatch(obj, updatedFields.rxs, function (err, obj) {
  //     console.log('2.2')
  //     if (err) {
  //       callback(err);
  //     } else {
  //       if (updatedFields.medication) {
  //         createMedicationAndAttactch(obj, updatedFields.medication, function (err, obj) {
  //           if (err) {
  //             callback(err);
  //           } else {
  //             callback(null, obj);
  //           }
  //         });
  //       } else {
  //         callback(null, obj);
  //       }
  //     }
  //   });
  // } else if (updatedFields.medication) {
  //   createMedicationAndAttactch(obj, updatedFields.medication, function (err, obj) {
  //     if (err) {
  //       callback(err);
  //     } else {
  //       callback(null, obj);
  //     }
  //   });
  // } else {
  //   callback(null, obj);
  // }
}
// function createRxsAndAttatch(obj, rxs, callback) {
//   if (rxs.length < 1) {
//     callback(null, obj);
//   }
//   if (Array.isArray(rxs)) {
//     var i = 0;

//     rxs.forEach(element => {
//       console.log(JSON.stringify(element));
//       createRxs(element, function (err, rxsCreated) {
//         obj.rxs.push(rxsCreated);
//         if (err) {
//           callback(err);
//           return;
//         } else if (i == rxs.length - 1) {
//           callback(null, obj);
//           return;
//         }
//         i++;
//       });
//     });
//   } else {
//     createRxs(rxs, function (err, rxsCreated) {
//       if (err) {
//         callback(err);
//       } else {
//         obj.rxs.push(rxsCreated);
//         callback(null, obj);
//       }
//     });
//   }
// }

/*
  if update rxs also need to check for rxsMed _id to see if we need to create or update
  we may need to also delete
*/
/* delete not working*/
function getRxs(dep,callback){
  let i = 0;
  let rxsArr = [];
  if(!dep.rxs || dep.rxs.length<1){
    callback(null,[]);
    return;
  }
  dep.rxs.forEach(rxs => {
  if(rxs._id){
      //update rxs
      updateRxs({updatedFields:rxs},rxs._id,function(err,rxsUpdated){
        i++;
        if(err){
          console.log(err);
        }else{
          rxsArr.push(rxsUpdated);
        }
        if(i == dep.rxs.length){
          callback(null,rxsArr);
          return;
        }
      });
    }else{
      createRxs(rxs,function(err,rxsCreated){
        i++;
        if(err){
          console.log(err);
        }else{
          rxsArr.push(rxsCreated);
        }
        if(i == dep.rxs.length){
          callback(null,rxsArr);
          return;
        }
      });
    }

  });
}
function createMedicationAndAttactch(obj, medication, callback) {
  if (medication.length < 1) {
    callback(null, obj);
  }
  if (Array.isArray(medication)) {
    var i = 0;

    medication.forEach(element => {
      createMedication(element, function (err, medicationCreated) {
        obj.medications.push(medicationCreated);
        if (err) {
          callback(err);
          return;
        } else if (i == medication.length - 1) {
          callback(null, obj);
          return;
        }
        i++;
      });
    });
  } else {
    createMedication(medication, function (err, medCreated) {
      if (err) {
        callback(err);
      } else {
        obj.medications.push(medCreated);
        callback(null, obj);
      }
    });
  }
}
function deleteAllRxs(rxs, callback) {
  if (rxs.length < 1) {
    callback(null, "None");
    return;
  }
  var i = 0;
  var error = false;
  rxs.forEach(element => {
    rxsDelete(element._id.toString(), function (err, deletedDoc) {
      if (err) {
        callback(error);
        return;
      } else if (i == rxs.length - 1) {
        callback(null, "All deleted");
        return;
      }
      i++;
    });
  });
}
function deleteAllOTC(otcMeds, callback) {
  if (otcMeds.length < 1) {
    callback(null, "None");
    return;
  }
  var i = 0;
  var error = false;
  otcMeds.forEach(element => {
    medDelete(element._id.toString(), function (err, deletedDoc) {
      if (err) {
        callback(error);
        return;
      } else if (i == otcMeds.length - 1) {
        callback(null, "All deleted");
        return;
      }
      i++;
    });
  });
}
function deleteDependentById(id, callback) {
  dependentModel.findOneAndDelete({ _id: id }).populate('rxs').populate('medications').exec(function (err, dependentFound) {
    if (err) {
      callback(err);
    } else if (!dependentFound) {
      callback("Dependent not found.");
    } else {
      deleteAllRxs(dependentFound.rxs, function (err, result) {
        if (err) {
          callback(err);
        } else {
          deleteAllOTC(dependentFound.medications, function (err, result) {
            if (err) {
              callback(err);
            } else {
              callback(null, dependentFound);
            }
          });
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


  if (typeof (bodyData.rxs) != 'undefined') {
    getRxs(bodyData,function (err, rxs) {
      if (err) {
        callback(err);
      }else{
        newDoc.rxs = rxs;
        newDoc.save(function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      }
    });
  } else if (bodyData.medication) {
    createMedicationAndAttactch(newDoc, bodyData.medication, function (err, newDoc) {
      if (err) {
        callback(err);
      } else {
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
  dependentModel.find({}).populate('rxs').populate('medications').exec(function (err, result) {
    if (err) {
      callback(err);
    } else {
      rxsMedicationModel.populate(result, { path: 'rxs.rxsMedications' }, function (err, finalResult) {
        if (err) {
          callback(err)
        } else {
          callback(null, finalResult);
        }
      });
    }
  });
}
function removeOTCMedsFromDep(depId, medId, callback) {
  Medication.findByIdAndDelete(medId, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback('Medication not found.');
    } else {
      callback(null, result);
    }
  })
}



module.exports = { findDependentById, findDependents, createDependent, deleteDependentById, patchUpdateDependentById, getDependentsWithMeds, removeOTCMedsFromDep };