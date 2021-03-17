const RxsMedModel = require('../models/rxsMedication/RxsMedication');
const val = require('./helpers/helper');
const delMedEvent = require('./medicationEvent').deleteById;
const QRCode = require('qrcode');
const {CLIENT_URL} = require('../config/configVars');
const fs = require('fs');

function findAll(callback) {
  RxsMedModel.find({}, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}
function base64_encode(qrCode) {
  return new Buffer(qrCode).toString('base64');
}
function createCode(data,callback) {
  let filepath = './config/pdf/QR-codes/current.png';
  QRCode.toFile(filepath,data,function(err,result){
    if(err){
      callback(err);
    }else{
      const file_buffer  = fs.readFileSync(filepath);
      const contents_in_base64 = file_buffer.toString('base64');
      callback(null,contents_in_base64);
    }
  });
}
// QRCode.toFile('./test.png',"test",function(err,result){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(result)
//   }
// });
// function findByIdWithQR(ids,callback){
//   if(ids.length<1){
//     callback(null,[]);
//     return;
//   }
//   var i = 0;
//   var rxsMeds = [];

//   ids.forEach(element => {
//     findById(element.toString(),function(err,rxsMedFound){
//       if(err){
//         callback(err);
//         return;
//       }else{
//         createCode(rxsMedFound.name,'utf8',function(err,code){
//           if(err){
//             callback(err);
//             return;
//           }else{
//             let med = JSON.parse(JSON.stringify(rxsMedFound));
//             med.base64 = base64_encode(code);
//             rxsMeds.push(med);
//             if(rxsMeds.length == ids.length){
//               callback(null,rxsMeds);
//             }
//           }
//           i++;
//         });
//       }
//     });
//   });
// }
function findById(id, callback) {
  RxsMedModel.findById(id, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}
function patchUpdateById(body, id, callback) {
  RxsMedModel.findById(id, function (err, foundDoc) {
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
function formateDate(date) {
  let dates = date.split('-');
  let yyyy = dates[0];
  let mm = dates[1];
  let dd = dates[2];
  return (mm + "-" + dd + "-" + yyyy);
}
function updateModifiedFields(oldDoc, updatedFields) {
  var name = oldDoc.name;
  var dosage = oldDoc.dosage;
  var reason = oldDoc.reason;
  var datePrescribed = oldDoc.datePrescribed;
  var instructions = oldDoc.instructions;
  var endDate = oldDoc.endDate;
  var whenToTake = oldDoc.whenToTake;
  var events = oldDoc.events;

  if (updatedFields.name) {
    name = updatedFields.name;
  }
  if (updatedFields.quantity) {
    dosage.quantity = updatedFields.quantity;
  }
  if (updatedFields.unit) {
    dosage.unit = updatedFields.unit;
  }
  if (updatedFields.reason) {
    reason = updatedFields.reason;
  }
  if (updatedFields.datePrescribed) {
    datePrescribed = formateDate(updatedFields.datePrescribed);
  }
  if (updatedFields.instructions) {
    instructions = updatedFields.instructions;
  }
  if (updatedFields.endDate) {
    endDate = formateDate(updatedFields.endDate);
  }
  if (updatedFields.event) {
    callback("EVENT NOT IMPLEMENTED");
  }
  if (updatedFields.whenToTake) {

    let whenToTakearr = [];
    for (var i = 0; i < updatedFields.whenToTake.length; ++i) {
      if (updatedFields.whenToTake[i] == "morning") {
        whenToTakearr.push("morning")
      }
      if (updatedFields.whenToTake[i] == "afternoon") {
        whenToTakearr.push("afternoon")
      }
      if (updatedFields.whenToTake[i] == "evening") {
        whenToTakearr.push("evening")
      }
    }

    if (whenToTake.length < 1) {
      callback("When to take is required!");
    } else {
      whenToTake = whenToTakearr;
    }

  } else {
    callback("Need multiple values for when to take option");
  }


  var obj = {
    name: name,
    dosage: dosage,
    reason: reason,
    datePrescribed: datePrescribed,
    instructions: instructions,
    endDate: endDate,
    whenToTake: whenToTake,
    events: events
  }
  return obj;
}

function deleteById(id, callback) {
  RxsMedModel.findOneAndDelete({ _id: id }).populate('events').exec(function (err, deletedDoc) {
    if (err) {
      callback(err);
    } else if (!deletedDoc) {
      callback("Doc not found.");
    } else {
      deleteAllRxsMedEvents(deletedDoc.events, function (err, res) {
        if (err) {
          callback(err);
        } else {
          callback(null, res);
        }
      });
    }
  });
}
function deleteAllRxsMedEvents(rxsMeds, callback) {
  if (rxsMeds.length < 1) {
    callback(null, "None");
    return;
  }
  var i = 0;
  var error = false;
  rxsMeds.forEach(element => {
    delMedEvent(element._id.toString(), function (err, deletedDoc) {
      if (err) {
        callback(error);
        return;
      } else if (i == rxsMeds.length - 1) {
        callback(null, "All deleted");
        return;
      }
      i++;
    });
  });
}

function saveToDoc(bodyData, schemaModel, callback) {
  //Later maybe make this generic
  var newDoc = new schemaModel({
    name: bodyData.name,
    dosage: {
      quantity: bodyData.quantity,
      unit: bodyData.unit
    },
    reason: bodyData.reason,
    datePrescribed: formateDate(bodyData.datePrescribed)
  });
  if (typeof (bodyData.instructions) != 'undefined') {
    newDoc.instructions = bodyData.instructions
  }
  if (typeof (bodyData.endDate) != 'undefined') {
    newDoc.endDate = formateDate(bodyData.endDate);
  }
  if (typeof (bodyData.whenToTake) != 'undefined' && bodyData.whenToTake.length > 0) {
    let whenToTake = [];
    for (var i = 0; i < bodyData.whenToTake.length; ++i) {
      if (bodyData.whenToTake[i] == "morning") {
        whenToTake.push("morning")
      }
      if (bodyData.whenToTake[i] == "afternoon") {
        whenToTake.push("afternoon")
      }
      if (bodyData.whenToTake[i] == "evening") {
        whenToTake.push("evening")
      }
    }

    if (whenToTake.length < 1) {
      callback("When to take is required!");
    } else {
      newDoc.whenToTake = whenToTake;
    }

  } else {
    callback("Need multiple values for when to take option");
  }
  if (typeof (bodyData.events) != 'undefined') {
    callback("Create events function still needs to be created");
    //create Events
  }
  let refID = require("crypto").randomBytes(64).toString('hex');
  let logURL = CLIENT_URL + "/user/log-med/" + refID;
  newDoc.refID = refID;
  createCode(logURL,function (err, code) {
    if (err) {
      callback(err);
    } else {
      newDoc.base64 = code;
      newDoc.save(function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });


}

function create(body, callback) {
      saveToDoc(body, RxsMedModel, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
}


module.exports = { findAll, findById, patchUpdateById, deleteById, create }