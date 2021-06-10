let Guardian = require('../models/guardian/Guardian');
let rxsMedicationModel = require('../models/rxsMedication/RxsMedication');
let userModel = require('../models/user/User');
let Dependent = require('../models/dependent/Dependent');
let findGuardianByID = require('./guardian').findById;
let { isMedEventValid } = require('../config/globalHelpers');
let { getCurrentTime } = require('../config/rootHelpers');
let medicationEventModel = require('../models/medicationEvent/MedicationEvent');

function getEventByRxsMedID(rxsMedID, callback) {
  rxsMedicationModel.findById(rxsMedID).populate("events").exec(function (err, rxsMedFound) {
    if (err) {
      callback(err);
    } else if (!rxsMedFound) {
      callback("Medication not found.");
    } else{
      callback(null,rxsMedFound)
    }
  });
}

function patchUpdateById(body, id, callback) {
  medicationEventModel.findById(id, function (err, foundDoc) {
    if (err) {
      callback(err);
    } else if (!foundDoc) {
      callback("Doc not found");
    } else if (body.guardianID) {
      findGuardianByID(body.guardianID, function (err, guardianFound) {
        if (err) {
          callback(err);
        } else if (!guardianFound) {
          callback("Guardian not found.");
        } else {
          body.guardian = guardianFound;
          updateModifiedFields(foundDoc, body, function (err, obj) {
            foundDoc.update(obj, function (err, result) {
              if (err) {
                callback(err);
              } else {
                callback(null, result);
              }
            });
          });
        }
      });
    } else {
      updateModifiedFields(foundDoc, body, function (err, obj) {
        foundDoc.update(obj, function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      });
    }
  });

}
function findGuardianByJWT(jwt, callback) {
  userModel.findOne({ 'auth.token': jwt }, function (err, userFound) {
    if (err) {
      callback(err);
    } else if (!userFound) {
      callback("user not found");
    } else {
      Guardian.findOne({ user: userFound }, function (err, guardianFound) {
        if (err) {
          callback(err);
        } else if (!guardianFound) {
          callback("Guardian not found");
        } else {
          callback(null, guardianFound);
        }
      });
    }
  });
}
function tookMedicationRefID(rxsMed, body, callback) {
  if (!isMedEventValid(rxsMed.events, rxsMed.whenToTake, false)) {
    callback("Don't have access to log this medication.");
  } else {
    findGuardianByID(body.guardianID, function (err, guardianFound) {
      if (err) {
        callback(err);
      } else if (!guardianFound) {
        callback("Guardian not found.");
      } else {
        getDependentByRxsMedication(rxsMed._id, function (err, dependent) {
          if (err) {
            callback(err);
          } else {
            createRxsMedEvent(body, dependent, rxsMed, guardianFound, function (err, rxsMedEvent) {
              if (err) {
                callback(err);
              } else {
                attatchRxsMedEventToRxsMed(rxsMedEvent, rxsMed, function (err, result) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, rxsMedEvent);
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}
function tookMedication(rxsMedId, jwt, body, user, callback) {
  rxsMedicationModel.findById(rxsMedId).populate('events').exec(function (err, rxsMedicationFound) {
    if (err) {
      callback(err);
    } else if (!rxsMedicationFound) {
      callback("Rxs medication doesn't exist.");
    } else if (!isMedEventValid(rxsMedicationFound.events, rxsMedicationFound.whenToTake, user.isAdmin)) {
      callback("Don't have access to log this medication.");
    } else if (!body.guardianID) {

      findGuardianByJWT(jwt, function (err, guardianFound) {
        if (err) {
          callback(err);
        } else {
          getDependentByRxsMedication(rxsMedicationFound, function (err, dependent) {
            if (err) {
              callback(err);
            } else {
              createRxsMedEvent(body, dependent, rxsMedicationFound, guardianFound, function (err, rxsMedEvent) {
                if (err) {
                  callback(err);
                } else {
                  attatchRxsMedEventToRxsMed(rxsMedEvent, rxsMedicationFound, function (err, result) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(null, rxsMedEvent);
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      findGuardianByID(body.guardianID, function (err, guardianFound) {
        if (err) {
          callback(err);
        } else {
          getDependentByRxsMedication(rxsMedicationFound, function (err, dependent) {
            if (err) {
              callback(err);
            } else {
              createRxsMedEvent(body, dependent, rxsMedicationFound, guardianFound, function (err, rxsMedEvent) {
                if (err) {
                  callback(err);
                } else {
                  attatchRxsMedEventToRxsMed(rxsMedEvent, rxsMedicationFound, function (err, result) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(null, rxsMedEvent);
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
function attatchRxsMedEventToRxsMed(rxsMedEvent, rxsMed, callback) {
  rxsMed.events.push(rxsMedEvent);
  rxsMed.save(function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}
function createRxsMedEvent(body, dependent, rxsMedication, guardian, callback) {
  var guardianName = guardian.name.firstName + " " + guardian.name.lastName;
  var dependentName = dependent.name.firstName + " " + dependent.name.lastName;

  var medicationEventBody = {
    title: dependentName + " took " + rxsMedication.name,
    isAway: body.isAway,
    notes: body.notes,
    dateTaken: getCurrentTime(),
    dependent: dependent,
    createdBy: guardian,
    createdByStr: guardianName
  }
  create(medicationEventBody, function (err, medEventCreated) {
    if (err) {
      callback(err);
    } else {
      callback(null, medEventCreated);
    }
  });
}
function getDependentByRxsMedication(rxsMedication, callback) {
  Dependent.findOne({ rxsMedications: rxsMedication }, function (err, dependentFound) {
    if (err) {
      callback(err);
    } else if (!dependentFound) {
      callback("Dependent not found.");
    } else {
      callback(null, dependentFound);
    }
  });
}
function updateModifiedFields(oldDoc, updatedFields, callback) {
  var title = oldDoc.title;
  var isAway = oldDoc.isAway;
  var notes = oldDoc.notes;
  var dependent = oldDoc.dependent;
  var createdBy = oldDoc.createdBy;
  var createdByStr = oldDoc.createdByStr;
  var dateTaken = oldDoc.dateTaken;

  if (updatedFields.title) {
    title = updatedFields.title;
  }
  if (typeof (updatedFields.isAway) != undefined) {
    isAway = updatedFields.isAway;
  }
  if (typeof (updatedFields.notes) != undefined) {
    notes = updatedFields.notes;
  }
  if (updatedFields.dependent) {
    dependent = updatedFields.dependent;
  }
  if (updatedFields.guardian) {
    createdBy = updatedFields.guardian;
    createdByStr = updatedFields.guardian.name.firstName + " " + updatedFields.guardian.name.lastName;
  }
  if (updatedFields.dateTaken) {
    dateTaken = updatedFields.dateTaken;
  }
  var obj = {
    title: title,
    isAway: isAway,
    notes: notes,
    dateTaken: dateTaken,
    dependent: dependent,
    createdBy: createdBy,
    createdByStr: createdByStr
  }

  callback(null, obj);
}


function deleteById(id, callback) {
  medicationEventModel.findOneAndDelete({ _id: id }).exec(function (err, deletedDoc) {
    if (err) {
      callback(err);
    } else if (!deletedDoc) {
      callback("Medication event not found.");
    } else {
      callback(null, deletedDoc);
    }
  });
}
function saveToDoc(bodyData, schemaModel, callback) {
  var newDoc = new schemaModel({
    title: bodyData.title,
    event: bodyData.event,
    isAway: bodyData.isAway,
    dateTaken: bodyData.dateTaken,
    dependent: bodyData.dependent,
    createdBy: bodyData.createdBy,
    createdByStr: bodyData.createdBy.name.firstName + " " + bodyData.createdBy.name.lastName
  });
  if (typeof (bodyData.notes) != 'undefined') {
    newDoc.notes = bodyData.notes;
  }
  newDoc.save(function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });

}

function create(body, callback) {
  saveToDoc(body, medicationEventModel, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });

}


module.exports = {
  create, deleteById, patchUpdateById,
  tookMedication, tookMedicationRefID, getEventByRxsMedID
};
