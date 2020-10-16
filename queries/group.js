const groupModel = require('../models/group/Group');
const dependentModel = require('../models/dependent/Dependent');
const guardianModel = require('../models/guardian/Guardian');
const val = require('./helpers/helper');
const { forEach } = require('lodash');

function findById(id, callback) {
  groupModel.findById(id, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback("No group found.");
    } else {
      callback(null, result);
    }
  });
}
function findAll(callback) {
  groupModel.find({}).populate('dependents').populate('guardians').exec(function (err, res) {
    if (err) {
      callback(err);
    } else {
      callback(null, res);
    }
  });
}
function patchUpdateById(body, id, callback) {
  groupModel.findById(id, function (err, foundDoc) {
    if (err) {
      callback(err);
    } else if (!foundDoc) {
      callback("Document not found.");
    } else {
      console.log("\n\n\n\nFound Doc");
      console.log(foundDoc);
      console.log("\n\n\n\n\n")
      updateModifiedFields(foundDoc, body, function (err, newDoc) {
        if (err) {
          callback(err);
        } else {
          console.log("\n\n\n\nNew Doc");
          console.log(newDoc);
          console.log("\n\n\n\n\n")
          foundDoc.update(newDoc, function (err, result) {
            if (err) {
              callback(err);
            } else {
              console.log("\n\n\n\nResult");
              console.log(result);
              console.log("\n\n\n\n\n")
              callback(null, newDoc);
            }
          });
        }
      });
    }
  });
}
function removeDependent(dependent, oldDependents) {
  let id = dependent;
  if (typeof (dependent) == 'object') {
    id = dependent._id;
  }

  return removeByID(id, oldDependents);
}
function removeGuardian(guardian, oldGuardians) {
  let id = guardian;
  if (typeof (guardian) == 'object') {
    id = guardian._id;
  }

  return removeByID(id, oldGuardians);
}
function updateModifiedFields(oldDoc, body, callback) {
  var groupname = oldDoc.name;
  var dependents = oldDoc.dependents;
  var guardians = oldDoc.guardians;
  var pictureUrl = oldDoc.pictureUrl;

  if (body.pictureUrl) {
    pictureUrl = body.pictureUrl;
  }
  if (body.name) {
    groupname = body.name;
  }

  let obj = {
    name: groupname,
    pictureUrl: pictureUrl,
    dependents: dependents,
    guardians: guardians
  };

  saveAndUpdateDoc(obj, body, function (err, newDoc) {
    if (err) {
      callback(err);
    } else {
      callback(null, newDoc);
    }
  });

}
function saveAndUpdateDoc(newDoc, body, callback) {
  let count = 0;
  let index = 0;

  if (body.removeDependentID) {
    count++;
  }
  if (body.dependentID) {
    count++;
  }
  if (body.removeGuardianID) {
    count++;
  }
  if (body.guardianID) {
    count++;
  }
  if (body.dependentIDs) {
    count++;
  }
  if (body.guardianIDs) {
    count++;
  }

  if (body.removeDependentID) {
    newDoc.dependents = removeDependent(body.removeDependentID, newDoc.dependents);
    index++;
    if (index == count) {
      callback(null, newDoc);
    }
  }
  if (body.dependentID) {
    addDependentToGroup(newDoc, body.dependentID, function (err, newDoc) {
      index++;
      if (err && index == count) {
        callback(err);
      } else if (index == count) {
        callback(null, newDoc)
      }
    });
  }
  if (body.dependentIDs) {
    addDependentsToGroup(newDoc, body.dependentIDs, function (err, newDoc) {
      index++;
      if (err && index == count) {
        callback(err);
      } else if (index == count) {
        callback(null, newDoc)
      }
    });
  }
  if (body.guardianIDs) {
    addGuardiansToGroup(newDoc, body.guardianIDs, function (err, newDoc) {
      index++;
      console.log(index)
      console.log(count)
      if (err && index == count) {
        callback(err);
      } else if (index == count) {
        console.log('done');
        callback(null, newDoc)
      }
    });
  }
  if (body.guardianID) {
    addGuardianToGroup(newDoc, body.guardianID, function (err, newDoc) {
      index++;
      if (err && index == count) {
        callback(err);
      } else if (index == count) {
        callback(null, newDoc);
      }
    });
  }
  if (body.removeGuardianID) {
    newDoc.guardians = removeGuardian(body.removeGuardianID, newDoc.guardians);
    index++;
    if (index == count) {
      callback(null, newDoc);
    }
  }
  if (count == 0) {
    callback(null, newDoc);
  }
}
function addDependentToGroup(newDoc, dependentId, callback) {
  dependentModel.findById(dependentId, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback("Dependent not found.");
    } else {
      newDoc.dependents.push(result);
      callback(null, newDoc);
    }
  });
}
function addDependentsToGroup(newDoc, dependentIDs, callback) {
  let i = 0;
  forEach(dependentIDs,id =>{
    dependentModel.findById(id, function (err, result) {
      if (err) {
        callback(err);
        return;
      } else if (!result) {
        callback("Dependent not found.");
        return;
      }
      newDoc.dependents.push(result);
      if(i==dependentIDs.length-1){
        callback(null, newDoc);
      }
      i++;
    });
  });
}
function addGuardiansToGroup(newDoc, guardianIDs, callback) {
  let i = 0;
  forEach(guardianIDs,id =>{
    guardianModel.findById(id, function (err, result) {
      if (err) {
        callback(err);
        return;
      } else if (!result) {
        callback("Guardian not found.");
        return;
      }
      newDoc.guardians.push(result);
      if(i==guardianIDs.length-1){
        callback(null, newDoc);
      }
      i++;
    });
  });
}
function addGuardianToGroup(newDoc, guardianId, callback) {
  guardianModel.findById(guardianId, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback("Guardian not found.");
    } else {
      newDoc.guardians.push(result);
      callback(null, newDoc);
    }
  });
}
function removeByID(id, arr) {
  let newArr = [];
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i]._id != id) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
function deleteById(id, callback) {
  groupModel.findOneAndDelete({ _id: id }, function (err, deletedDoc) {
    if (err) {
      callback(err);
    } else {
      callback(null, deletedDoc);
    }
  });
}
function saveToDoc(body, callback) {
  var newDoc = new groupModel({
    name: body.name,
  });

  saveAndUpdateDoc(newDoc, body, function (err, newDoc) {
    if (err) {
      callback(err)
    } else {
      console.log(newDoc);
      newDoc.save(function (err, savedDoc) {
        if (err) {
          callback(err);
        } else {
          callback(null, savedDoc);
        }
      });
    }
  });

}
function create(body, callback) {
  console.log(body);
  val.validator(groupModel, body, function (err, result) {
    if (err) {
      callback(err);
    } else {
      saveToDoc(body, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
}


module.exports = { create, findAll, deleteById, findById, patchUpdateById };
