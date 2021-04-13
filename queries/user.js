const userModel = require('../models/user/User');
const val = require('./helpers/helper');
const Guardian = require('../models/guardian/Guardian');
const createGuardian = require('./guardian').create;
const updateGuardianByID = require('./guardian').patchUpdateById;
const findAllGroups = require('./group').findAll;
const RxsMedication = require('../models/rxsMedication/RxsMedication');
const MedicationEvent = require('../models/medicationEvent/MedicationEvent');
const Rxs = require('../models/rxs/Rxs');
const Medication = require('../models/medication/Medication');
const SECRET_KEY = process.env.SECRET_KEY || require('../config/configVars').SECRET_KEY;
const CAN_DELETE_ADMIN = process.env.CAN_DELETE_ADMIN || require('../config/configVars').CAN_DELETE_ADMIN || "false";
const { addDetailsToUser } = require('../config/globalHelpers');

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
      Rxs.populate(groups, { path: "dependents.rxs" }, function (err, res) {
        if (err) {
          callback(err);
        } else {
          RxsMedication.populate(res, { path: "dependents.rxs.rxsMedications" }, function (err, res) {
            if (err) {
              callback(err);
            } else {
              MedicationEvent.populate(res, { path: "dependents.rxs.rxsMedications.events",options:{sort:{'dateTaken':-1}} }, function (err, res) {
                if (err) {
                  callback(err);
                } else {
                  var res = JSON.parse(JSON.stringify(res));
                  var dependents = [];
                  for (var i = 0; i < res.length; ++i) {
                    var curGroup = res[i];
                    for (var ix = 0; ix < curGroup.dependents.length; ++ix) {
                      var curDep = curGroup.dependents[ix];
                      curDep.group = attatchGroup(curGroup);
                      dependents.push(curDep);
                    }
                  }
                  callback(null, dependents);
                }
              });
            }
          });
        }
      });
    }
  });
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
  });
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


module.exports = { create, findAll, findExceptMe, deleteById, findById, patchUpdateById, getDependents, createFirstUser, updateProfile };
