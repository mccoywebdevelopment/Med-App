const eventModel = require('../models/event/Event');
const val = require('./helpers/helper');
const Guardian = require('../models/guardian/Guardian');
const rxsMedicationModel = require('../models/rxsMedication/RxsMedication');
const Rxs = require('../models/rxs/Rxs');
const userModel = require('../models/user/User');
const Dependent = require('../models/dependent/Dependent');
const findGuardianByID = require('./guardian').findById;
const createEvent = require('./event').create;
const { isMedEventValid } = require('../config/globalHelpers');
const medicationEventModel = require('../models/medicationEvent/MedicationEvent');

function findById(id, callback) {
  eventModel.findById(id, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}
function findAll(callback) {
  eventModel.find({}, function (err, dependentFound) {
    if (err) {
      callback(err);
    } else {
      callback(null, dependentFound);
    }
  });
}
function getEventByRxsMedID(rxsMedID, callback) {
  rxsMedicationModel.findById(rxsMedID).populate("events").exec(function (err, rxsMedFound) {
    if (err) {
      callback(err);
    } else if (!rxsMedFound) {
      callback("Medication not found.");
    } else if (rxsMedFound.events.length < 1) {
      callback(null, rxsMedFound);
    } else {
      let i = 0;
      rxsMedFound.events.forEach((event, index) => {
        Guardian.findById(event.createdBy, function (err, guardian) {
          if (err) {
            callback(err);
            return;
          } else if (guardian) {
            rxsMedFound.events[index].createdBy = guardian;
          }
          if (i == rxsMedFound.events.length - 1) {
            callback(null, rxsMedFound);
            return;
          }
          i++;
        });
      });
    }
  });
}
function patchUpdateById(body, id, callback) {
  medicationEventModel.findById(id, function (err, foundDoc) {
    if (err) {
      callback(err);
    } else if (!foundDoc) {
      callback("Doc not found");
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
        getDependentByRxsMedId(rxsMed._id, function (err, dependent) {
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
    } else {
      findGuardianByJWT(jwt, function (err, guardianFound) {
        if (err) {
          callback(err);
        } else {
          getDependentByRxsMedId(rxsMedicationFound, function (err, dependent) {
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
function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var today = mm + '/' + dd + '/' + yyyy;
  return today;
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
  var message = rxsMedication.name + " was taken by " + dependentName + " recorded at " + getDate() + "."


  var eventBody = {
    name: guardianName + " recorded Medication.",
    message: message
  }

  createEvent(eventBody, function (err, eventCreated) {
    if (err) {
      callback(err);
    } else {
      var medicationEventBody = {
        title: dependentName + " took " + rxsMedication.name,
        isAway: body.isAway,
        notes: body.notes,
        dateTaken: new Date(),
        event: eventCreated,
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
  });
}
function getDependentByRxsMedId(rxsMedication, callback) {
  getRxsByRxsMed(rxsMedication, function (err, rxsFound) {
    if (err) {
      callback(err);
    } else if (!rxsFound) {
      callback("rxs not found");
    } else {
      getDependentByRxs(rxsFound, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
}
function getDependentByRxs(rxs, callback) {
  Dependent.findOne({ rxs: rxs }, function (err, dependentFound) {
    if (err) {
      callback(err);
    } else if (!dependentFound) {
      callback("Dependent not found.");
    } else {
      callback(null, dependentFound);
    }
  });
}
function getRxsByRxsMed(rxsMedication, callback) {
  Rxs.findOne({ rxsMedications: rxsMedication }, function (err, rxsFound) {
    if (err) {
      callback(err);
    } else {
      callback(null, rxsFound);
    }
  });
}
function updateModifiedFields(oldDoc, updatedFields, callback) {
  var title = oldDoc.title;
  var isAway = oldDoc.isAway;
  var notes = oldDoc.notes;
  var event = oldDoc.event;
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
  if (updatedFields.createdBy) {
    createdBy = updatedFields.createdBy;
    createdByStr = createdBy.name.firstName + " " + createdByStr.name.lastName;
  }
  if (updatedFields.dateTaken) {
    dateTaken = updatedFields.dateTaken;
  }
  var obj = {
    title: title,
    isAway: isAway,
    notes: notes,
    event: event,
    dateTaken: dateTaken,
    dependent: dependent,
    createdBy: createdBy,
    createdByStr: createdByStr
  }
  if (updatedFields.event && updatedFields.event.timeStamp) {
    var newEvent = event;
    newEvent.timeStamp = updatedFields.event.timeStamp;
    eventModel.findOneAndUpdate({ _id: obj.event._id }, { timeStamp: updatedFields.event.timeStamp },
      function (err, result) {
        if (err) {
          callback(err);
        } else {
          obj.event = result;
          callback(null, obj);
        }
      });
  } else {
    callback(null, obj);
  }
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
  create, findAll, deleteById, findById, patchUpdateById,
  tookMedication, getEventByRxsMedID, tookMedicationRefID
};
