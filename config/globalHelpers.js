const User = require('../models/user/User');
const RxsMedication = require('../models/rxsMedication/RxsMedication');
const VALID_TIMES = process.env.VALID_TIMES || require('./configVars').VALID_TIMES;


function verifyUser(req, res, next) {
    var todayDate = new Date();
    var token = req.params.JWT;
    if (typeof (token) == 'undefined' || !token) {
        token = req.body.JWT;
    }
    if (!token) {
        next({ error: "Token is undefined." });
    } else {
        User.findOne({ "auth.token": token }, function (err, userFound) {
            if (err) {
                next({ error: err });
            } else if (!userFound) {
                next({ error: "User not found." });
            } else if (!userFound.auth.isVerified) {
                next({ error: "User is not verified" });
            } else if (todayDate > userFound.auth.expiresIn) {
                next({ error: "Token expired" })
            } else {
                req.user = userFound;
                next();
            }
        });
    }
}
function verifyRefID(req,res,next){
    let refID = req.params.refID;
    RxsMedication.findOne({refID:refID}).populate('events').exec(function(err,result){
        if(err){
            next({error: err})
        }else if(!result){
            next({error:"RefID is invalid or medication no longer exists."})
        }else{
            req.rxsMedicationRefID = result;
            next();
        }
    });
}
function verifyAdmin(req, res, next) {
    var todayDate = new Date();
    var token = req.params.JWT;
    if (typeof (token) == 'undefined' || !token) {
        token = req.body.JWT;
    }
    if (!token) {
        next({ error: "Token is undefined." });
    } else {
        User.findOne({ "auth.token": token }, function (err, userFound) {
            if (err) {
                next({ error: err });
            } else if (!userFound) {
                next({ error: "User not found." });
            } else if (!userFound.auth.isVerified) {
                next({ error: "User is not verified" });
            } else if (!userFound.isAdmin) {
                next({ error: "User does not have admin rights." })
            } else if (todayDate > userFound.auth.expiresIn) {
                next({ error: "Token expired" })
            } else {
                req.user = userFound;
                next();
            }
        });
    }
}
function findUserByJwt(jwt, callback) {
    User.findOne({ 'auth.token': jwt }, function (err, userFound) {
        if (err) {
            callback(err);
        } else if (!userFound) {
            callback("user not found");
        } else {
            callback(null, userFound);
        }
    });
}
function addDetailsToUser(guardian, user) {
    if (guardian) {
        user = JSON.parse(JSON.stringify(user));
        user.phoneNumber = guardian.phoneNumber || "";
        user.guardianID = guardian._id;
        if (guardian.name && guardian.name.firstName && guardian.name.lastName) {
            user.name = guardian.name.firstName + " " + guardian.name.lastName;
        } else {
            user.name = "";
        }
    }

    return user;
}
function isLessThan(end) {
    let today = new Date();
    if (today <= end) {
      return true
    }
    return false;
  }
function isToday(someDate) {
    if (!someDate) {
        return false;
    }
    someDate = new Date(someDate);
    let today = new Date();
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}
function isBetween(time, start, end) {
    let today = new Date(time);
    if (start <= today && today <= end) {
        return true
    }
    return false;
}
function appendTimeToDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
  
    return [year, month, day].join('-');
  }
  function getPeriods(today){
    let morningStart = new Date(appendTimeToDate(today) + " " + VALID_TIMES.morning[0]);
    let morningEnd = new Date(appendTimeToDate(today) + " " + VALID_TIMES.morning[1]);

    let afternoonStart = new Date(appendTimeToDate(today) + " " + VALID_TIMES.afternoon[0]);
    let afternoonEnd = new Date(appendTimeToDate(today) + " " + VALID_TIMES.afternoon[1]);

    let eveningStart = new Date(appendTimeToDate(today) + " " + VALID_TIMES.evening[0]);
    let eveningEnd = new Date(appendTimeToDate(today) + " " + VALID_TIMES.evening[1]);

    return{morningStart,morningEnd,afternoonStart,afternoonEnd,eveningStart,eveningEnd}
  }
function isMedEventValid(events, whenToTake, isAdmin) {

    if(isAdmin){
        return true;
    }

    let i = 0;
    let morningFound = false;
    let afternoonFound = false;
    let eveningFound = false;
    let today = new Date();

    let {morningStart,morningEnd,afternoonStart,afternoonEnd,eveningStart,eveningEnd} = getPeriods(today);

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

    if (whenToTake.includes('morning') && !morningFound && isBetween(today,morningStart,morningEnd)) {
        return true
    }else if (whenToTake.includes('afternoon') && !afternoonFound && isBetween(today,afternoonStart,afternoonEnd)) {
        return true
    }
    else if (whenToTake.includes('evening') && !eveningFound && isBetween(today,eveningStart,eveningEnd)) {
        return true
    }else{
        return false
    }
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
module.exports = { verifyUser, verifyAdmin, formatAMPM, isMedEventValid, verifyRefID,
     findUserByJwt, addDetailsToUser, isToday, isBetween, isLessThan, appendTimeToDate, getPeriods };