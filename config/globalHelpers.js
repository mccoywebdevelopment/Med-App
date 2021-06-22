let User = require('../models/user/User');
let RxsMedication = require('../models/rxsMedication/RxsMedication');
let { getCurrentTime } = require('./rootHelpers'); 
const VALID_TIMES_MORNING_START = process.env.VALID_TIMES_MORNING_START || require('./configVars').VALID_TIMES_MORNING_START;
const VALID_TIMES_MORNING_END = process.env.VALID_TIMES_MORNING_END || require('./configVars').VALID_TIMES_MORNING_END;

const VALID_TIMES_AFTERNOON_START = process.env.VALID_TIMES_AFTERNOON_START || require('./configVars').VALID_TIMES_AFTERNOON_START;
const VALID_TIMES_AFTERNOON_END = process.env.VALID_TIMES_AFTERNOON_END || require('./configVars').VALID_TIMES_AFTERNOON_END;

const VALID_TIMES_EVENING_START = process.env.VALID_TIMES_EVENING_START || require('./configVars').VALID_TIMES_EVENING_START;
const VALID_TIMES_EVENING_END = process.env.VALID_TIMES_EVENING_END || require('./configVars').VALID_TIMES_EVENING_END;

function verifyUser(req, res, next) {
    var todayDate = getCurrentTime();
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
function verifyRefID(req, res, next) {
    let refID = req.params.refID;
    RxsMedication.findOne({ refID: refID }).populate('events').exec(function (err, result) {
        if (err) {
            next({ error: err })
        } else if (!result) {
            next({ error: "RefID is invalid or medication no longer exists." })
        } else {
            req.rxsMedicationRefID = result;
            next();
        }
    });
}
function verifyAdmin(req, res, next) {
    var todayDate = getCurrentTime();
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
    let today = getCurrentTime();
    end =  getCurrentTime(end)
    if (today <= end) {
        return true
    }
    return false;
}
function isGreatorThan(end) {
    let today = getCurrentTime();
    end = getCurrentTime(end)
    if (today >= end) {
        return true
    }
    return false;
}
function isToday(someDate) {
    if (!someDate) {
        return false;
    }
    someDate = getCurrentTime(someDate);
    let today = getCurrentTime();
    let bool = someDate.isSame(today,"day");
    return bool
}
function isBetween(time, start, end) {
    let today = getCurrentTime(time);
    end = getCurrentTime(end);
    start = getCurrentTime(start);

    if (start <= today && today <= end) {
        return true
    }
    return false;
}
function getPeriods(today) {
    let morningStartArr = VALID_TIMES_MORNING_START.split(':');
    let morningEndArr = VALID_TIMES_MORNING_END.split(':');
    let afternoonStartArr = VALID_TIMES_AFTERNOON_START.split(':');
    let afternoonEndArr = VALID_TIMES_AFTERNOON_END.split(':');
    let eveningStartArr = VALID_TIMES_EVENING_START.split(':');
    let eveningEndArr = VALID_TIMES_EVENING_END.split(':');

    let morningStart = getCurrentTime(today).set({'hour': morningStartArr[0], 'minute': morningStartArr[1]});
    let morningEnd =  getCurrentTime(today).set({'hour': morningEndArr[0], 'minute': morningEndArr[1]});

    let afternoonStart = getCurrentTime(today).set({'hour': afternoonStartArr[0], 'minute':  afternoonStartArr[1]});
    let afternoonEnd = getCurrentTime(today).set({'hour':  afternoonEndArr[0], 'minute':  afternoonEndArr[1]});

    let eveningStart = getCurrentTime(today).set({'hour': eveningStartArr[0], 'minute': eveningStartArr[1]});
    let eveningEnd = getCurrentTime(today).set({'hour': eveningEndArr[0], 'minute': eveningEndArr[1]});

    return { morningStart, morningEnd, afternoonStart, afternoonEnd, eveningStart, eveningEnd }
}
function isMedEventValid(events, whenToTake, isAdmin) {

    if (isAdmin) {
        return true;
    }

    let i = 0;
    let morningFound = false;
    let afternoonFound = false;
    let eveningFound = false;
    let today = getCurrentTime();

    let { morningStart, morningEnd, afternoonStart, afternoonEnd, eveningStart, eveningEnd } = getPeriods(today);

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

    if (whenToTake.includes('morning') && !morningFound && isBetween(today, morningStart, morningEnd)) {
        return true
    } else if (whenToTake.includes('afternoon') && !afternoonFound && isBetween(today, afternoonStart, afternoonEnd)) {
        return true
    }
    else if (whenToTake.includes('evening') && !eveningFound && isBetween(today, eveningStart, eveningEnd)) {
        return true
    } else {
        return false
    }
}
function formatAMPM(date) {
    date = getCurrentTime(date);
    return date.format('hh:mm a')
}
function formatMMDDYYYY(date){
    date = getCurrentTime(date);
    return date.format('MM/DD/YYYY')
}
module.exports = {
    verifyUser, verifyAdmin, formatAMPM, isMedEventValid, verifyRefID, isGreatorThan,
    findUserByJwt, addDetailsToUser, isToday, isBetween, isLessThan, getPeriods, formatMMDDYYYY
};