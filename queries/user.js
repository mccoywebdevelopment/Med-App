let userModel = require('../models/user/User');
let val = require('./helpers/helper');
let Guardian = require('../models/guardian/Guardian');
let createGuardian = require('./guardian').create;
let updateGuardianByID = require('./guardian').patchUpdateById;
let findAllGroups = require('./group').findAll;
let RxsMedication = require('../models/rxsMedication/RxsMedication');
let MedicationEvent = require('../models/medicationEvent/MedicationEvent');
let SECRET_KEY = process.env.SECRET_KEY || require('../config/configVars').SECRET_KEY;
let CAN_DELETE_ADMIN = process.env.CAN_DELETE_ADMIN || require('../config/configVars').CAN_DELETE_ADMIN;
let VALID_TIMES_MORNING_START = process.env.VALID_TIMES_MORNING_START || require('../config/configVars').VALID_TIMES_MORNING_START;
let VALID_TIMES_MORNING_END = process.env.VALID_TIMES_MORNING_END || require('../config/configVars').VALID_TIMES_MORNING_END;
let VALID_TIMES_AFTERNOON_START = process.env.VALID_TIMES_AFTERNOON_START || require('../config/configVars').VALID_TIMES_AFTERNOON_START;
let VALID_TIMES_AFTERNOON_END = process.env.VALID_TIMES_AFTERNOON_END || require('../config/configVars').VALID_TIMES_AFTERNOON_END;
let VALID_TIMES_EVENING_START = process.env.VALID_TIMES_EVENING_START || require('../config/configVars').VALID_TIMES_EVENING_START;
let VALID_TIMES_EVENING_END = process.env.VALID_TIMES_EVENING_END || require('../config/configVars').VALID_TIMES_EVENING_END;
let { addDetailsToUser, isToday, isBetween, appendTimeToDate } = require('../config/globalHelpers');
let { getCurrentTime } = require('../config/rootHelpers');

function getDependents(user, callback) {
  findAllGroups(function (err, allGroups) {
    if (err) {
      callback(err);
    } else {
      let groups = [];
      for (var i = 0; i < allGroups.length; ++i) {
        for (var ix = 0; ix < allGroups[i].guardians.length; ++ix) {
          if (allGroups[i].guardians[ix].user.toString() == user._id.toString()) {
            groups.push(allGroups[i]);
          }
        }
      }
      getDependentsRxs(groups,function(err,result){
        if(err){
          callback(err);
        }else{
          callback(null,result);
        }
      });
    }
  });
}
function getDependentsRxs(groups,callback){

      RxsMedication.populate(groups, { path: "dependents.rxsMedications" }, function (err, res) {
        if (err) {
          callback(err);
        } else {
          MedicationEvent.populate(res, { path: "dependents.rxsMedications.events", options: { sort: { 'dateTaken': -1 } } }, function (err, res) {
            if (err) {
              callback(err);
            } else {
              var res = JSON.parse(JSON.stringify(res));
              let activeArr = {
                morningMedsActive: [],
                afternoonMedsActive: [],
                eveningMedsActive: []
              }
              let historyArr = {
                morningMedsHistory: [],
                afternoonMedsHistory: [],
                eveningMedsHistory: []
              }
              let dependents = [];
              for (var i = 0; i < res.length; ++i) {
                var curGroup = res[i];
                for (var ix = 0; ix < curGroup.dependents.length; ++ix) {
                  var curDep = curGroup.dependents[ix];
                  curDep.group = attatchGroup(curGroup);
                  dependents.push(curDep);
                  let { active, history } = filterMedications(curGroup, curDep, [VALID_TIMES_MORNING_START,VALID_TIMES_MORNING_END],
                    [VALID_TIMES_AFTERNOON_START,VALID_TIMES_AFTERNOON_END],  [VALID_TIMES_EVENING_START,VALID_TIMES_EVENING_END]);

                  activeArr.morningMedsActive = activeArr.morningMedsActive.concat(active.morningMedsActive);
                  activeArr.afternoonMedsActive = activeArr.afternoonMedsActive.concat(active.afternoonMedsActive);
                  activeArr.eveningMedsActive = activeArr.eveningMedsActive.concat(active.eveningMedsActive);

                  historyArr.morningMedsHistory = historyArr.morningMedsHistory.concat(history.morningMedsHistory);
                  historyArr.afternoonMedsHistory = historyArr.afternoonMedsHistory.concat(history.afternoonMedsHistory);
                  historyArr.eveningMedsHistory = historyArr.eveningMedsHistory.concat(history.eveningMedsHistory);
                }
              }
              let obj = {
                activeArr,
                historyArr,
                dependents,
                res,
                morning: [VALID_TIMES_MORNING_START,VALID_TIMES_MORNING_END],
                afternoon: [VALID_TIMES_AFTERNOON_START,VALID_TIMES_AFTERNOON_END],
                evening: [VALID_TIMES_EVENING_START,VALID_TIMES_EVENING_END]
              }
              callback(null, obj);
            }
          });
        }
      });
}
function getMedHistory(whenToTake, events, morningStart, morningEnd,
  afternoonStart, afternoonEnd, eveningStart, eveningEnd, medObj, historyArr) {

  let i = 0;
  while (events && i < events.length && isToday(events[i].dateTaken)) {
    if (whenToTake.includes('morning') && isBetween(events[i].dateTaken, morningStart, morningEnd)) {
      historyArr.morningMedsHistory.push(medObj)
    }
    if (whenToTake.includes('afternoon') && isBetween(events[i].dateTaken, afternoonStart, afternoonEnd)) {
      historyArr.afternoonMedsHistory.push(medObj)
    }
    if (whenToTake.includes('evening') && isBetween(events[i].dateTaken, eveningStart, eveningEnd)) {
      historyArr.eveningMedsHistory.push(medObj)
    }
    i++;
  }

  return historyArr
}
function getMedActive(whenToTake, events, morningStart, morningEnd,
  afternoonStart, afternoonEnd, eveningStart, eveningEnd, medObj, activeArr) {

  let i = 0;
  let morningFound = false;
  let afternoonFound = false;
  let eveningFound = false;


  while (events && i < events.length && isToday(events[i].dateTaken)) {
    if (isBetween(events[i].dateTaken, morningStart, morningEnd)) {
      morningFound = true;
    }
    if (isBetween(events[i].dateTaken, afternoonStart, afternoonEnd)) {
      afternoonFound = true;
    }
    if (isBetween(events[i].dateTaken, eveningStart, eveningEnd)) {
      eveningFound = true;
    }
    i++
  }


  if (whenToTake.includes('morning') && !morningFound) {
    activeArr.morningMedsActive.push(medObj)
  }
  if (whenToTake.includes('afternoon') && !afternoonFound) {
    activeArr.afternoonMedsActive.push(medObj)
  }
  if (whenToTake.includes('evening') && !eveningFound) {
    activeArr.eveningMedsActive.push(medObj)
  }

  return activeArr;
}
function filterMedications(group, dep, morning, afternoon, evening) {
  let today = getCurrentTime();

  let morningStart = Date.parse(appendTimeToDate(today) + " " + morning[0]);
  let morningEnd = Date.parse(appendTimeToDate(today) + " " + morning[1]);

  let afternoonStart = Date.parse(appendTimeToDate(today) + " " + afternoon[0]);
  let afternoonEnd = Date.parse(appendTimeToDate(today) + " " + afternoon[1]);

  let eveningStart = Date.parse(appendTimeToDate(today) + " " + evening[0]);
  let eveningEnd = Date.parse(appendTimeToDate(today) + " " + evening[1]);

  let active = {
    morningMedsActive: [],
    afternoonMedsActive: [],
    eveningMedsActive: []
  };
  let history = {
    morningMedsHistory: [],
    afternoonMedsHistory: [],
    eveningMedsHistory: []
  }
    for (var z = 0; z < dep.rxsMedications.length; ++z) {

      let whenToTake = dep.rxsMedications[z].whenToTake;
      let events = dep.rxsMedications[z].events;
      let medObj = {
        dependent: dep,
        group: group,
        rxsMedication: dep.rxsMedications[z]
      }
      history = getMedHistory(whenToTake, events, morningStart, morningEnd,
        afternoonStart, afternoonEnd, eveningStart, eveningEnd, medObj, history);

      active = getMedActive(whenToTake, events, morningStart, morningEnd,
        afternoonStart, afternoonEnd, eveningStart, eveningEnd, medObj, active);
    }
  morning = [morningStart, morningEnd];
  afternoon = [afternoonStart, afternoonEnd];
  evening = [eveningStart, eveningEnd];
  return { history, active, morning, afternoon, evening }
}
function attatchGroup(group) {
  return _objectWithoutProperties(group, ["dependents"])
}
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}
function findById(id, callback) {
  userModel.findById(id, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}
function findAll(callback) {
  userModel.find({}, function (err, dependentFound) {
    if (err) {
      callback(err);
    } else {
      callback(null, dependentFound);
    }
  });
}
function findExceptMe(jwt, callback) {
  userModel.find({}, function (err, dependentFound) {
    if (err) {
      callback(err);
    } else {
      var arr = [];
      for (var i = 0; i < dependentFound.length; ++i) {
        if (jwt != dependentFound[i].auth.token) {
          arr.push(dependentFound[i]);
        }
      }
      callback(null, arr);
    }
  });
}

function patchUpdateById(body, id, callback) {
  userModel.findById(id, function (err, foundDoc) {
    if (err) {
      callback(err);
    } else {
      var obj = updateModifiedFields(foundDoc, body);
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

function updateModifiedFields(oldDoc, updatedFields) {
  var username = oldDoc.username;
  // var password = oldDoc.password;
  var isAdmin = oldDoc.isAdmin;

  if (updatedFields.userName) {
    username = updatedFields.username;
  }
  if (typeof (updatedFields.isAdmin) != undefined) {
    isAdmin = updatedFields.isAdmin;
  }
  var obj = {
    username: username,
    // password: password,
    isAdmin: isAdmin
  }
  return obj;
}

function updateProfile(body, callback) {
  userModel.findById(body._id, function (err, userFound) {
    if (err) {
      callback(err);
    } else if (!userFound) {
      callback("User not found.");
    } else {
      delete body._id;
      let bodyGuard = {
        updatedFields: body
      }
      if (body.notifications) {
        updateUserNotification(userFound, body.notifications.type, body.notifications.recieve, function (err, userFound) {
          if (err) {
            callback(err);
          } else {
            updateGuardian(bodyGuard, userFound, function (err, result) {
              if (err) {
                callback(err);
              } else {
                callback(null, result);
              }
            });
          }
        });
      } else {
        updateGuardian(bodyGuard, userFound, function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      }
    }
  });
}

function updateGuardian(bodyGuard, userFound, callback) {
  Guardian.findOne({ user: userFound._id }, function (err, guardianFound) {
    if (err) {
      callback(err);
    } else if (!guardianFound) {
      callback("Guardian not found.");
    } else {
      updateGuardianByID(bodyGuard, guardianFound._id, function (err, updatedDoc) {
        if (err) {
          callback(err);
        } else {
          let userObj = addDetailsToUser(updatedDoc, userFound);
          callback(null, { result: userObj });
        }
      });
    }
  });
}

function updateUserNotification(user, notificationType, isNotified, callback) {
  if (notificationType != 'email') {
    callback("Notification type not valid expected: email");
  } else {
    user.notifications = {
      type: notificationType,
      recieve: isNotified
    }

    user.save(function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  }
}

function deleteById(id, callback) {
  userModel.findOne({ _id: id }, function (err, userFound) {
    if (err) {
      callback(err);
    } else if (!userFound) {
      callback('User could not be found.');
    } else if (userFound.isAdmin && CAN_DELETE_ADMIN.toString().toLowerCase() == "false") {
      callback('Delete admin setting is selected to false.');
    } else {
      userFound.deleteOne(function (err, deletedDoc) {
        if (err) {
          callback(err);
        } else {
          Guardian.find({ user: id }).remove().exec(function (err, guardianDeleted) {
            if (err) {
              callback(err);
            } else {
              callback(null, deletedDoc);
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
    username: bodyData.username,
  });
  if (typeof (bodyData.password) != 'undefined') {
    newDoc.password = bodyData.password;
  }
  if (typeof (bodyData.isAdmin) != 'undefined') {
    if (typeof (bodyData.isAdmin) == 'string') {
      if (bodyData.isAdmin.toLowerCase() == 'true') {
        bodyData.isAdmin = true;
      } else {
        bodyData.isAdmin = false;
      }
    }
    newDoc.isAdmin = bodyData.isAdmin;
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
  val.validator(userModel, body, function (err, result) {
    if (err) {
      callback(err);
    } else {
      userModel.findOne({ username: body.username }, function (err, userFound) {
        if (err) {
          callback(err);
        } else if (userFound) {
          callback("User with that email/username already exists.");
        } else {
          saveToDoc(body, userModel, function (err, result) {
            if (err) {
              callback(err);
            } else {
              callback(null, result);
            }
          });
        }
      });
    }
  });


}

function createFirstUser(secretKey, email, password, callback) {
  userModel.find({}, function (err, result) {
    if (err) {
      callback(err);
    } else if (result.length > 0) {
      callback("User already created");
    } else if (secretKey != SECRET_KEY) {
      callback("Invalid Key");
    } else {
      let firstUser = new userModel({
        username: email,
        password: password,
        isAdmin: true
      });
      firstUser.auth.isVerified = true;

      firstUser.save(function (err, userCreated) {
        if (err) {
          callback(err);
        } else {
          let guardBody = {
            user: userCreated._id,
            firstName: "ADMIN",
            lastName: "ONE",
            phoneNumber: 11111111
          }

          createGuardian(guardBody, function (err, guardCreated) {
            if (err) {
              callback(err);
            } else {
              guardCreated.user = result;
              callback(null, guardCreated);
            }
          });
        }
      });
    }
  });
}


module.exports = { create, findAll, findExceptMe, deleteById, findById, patchUpdateById,
   getDependents, createFirstUser, updateProfile, getDependentsRxs };
