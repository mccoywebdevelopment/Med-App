let { getPeriods, isGreatorThan } = require('../config/globalHelpers');
let { getCurrentTime } = require('../config/rootHelpers');
let { getGroups } = require('./shared');
let VALID_TIMES_MORNING_END = process.env.VALID_TIMES_MORNING_END || require('../config/configVars').VALID_TIMES_MORNING_END;
let VALID_TIMES_AFTERNOON_END = process.env.VALID_TIMES_AFTERNOON_END || require('../config/configVars').VALID_TIMES_AFTERNOON_END;
let VALID_TIMES_EVENING_END = process.env.VALID_TIMES_EVENING_END || require('../config/configVars').VALID_TIMES_EVENING_END;
let currentTime = getCurrentTime();
let createAdminNotification = require('../queries/notifications').create;
let { getDependentsRxs } = require('../queries/user');

function getActiveMedsForPrevPeriods(activeArr, historyArr) {
    let arr = [];
    let { morningEnd, afternoonEnd, eveningEnd } = getPeriods(currentTime);
    /*
    Need to loop through and check if 
    */
    if (isGreatorThan(morningEnd) && activeArr.morningMedsActive.length > 0) {
        arr.push({
            type: 'morning',
            arr: activeArr.morningMedsActive,
            periodEnd: VALID_TIMES_MORNING_END
        })
    }
    if (isGreatorThan(afternoonEnd) && activeArr.afternoonMedsActive.length > 0) {
        arr.push({
            type: 'afternoon',
            arr: activeArr.afternoonMedsActive,
            periodEnd: VALID_TIMES_AFTERNOON_END
        })
    }
    if (isGreatorThan(eveningEnd) && activeArr.eveningMedsActive.length > 0) {
        arr.push({
            type: 'evening',
            arr: activeArr.eveningMedsActive,
            periodEnd: VALID_TIMES_EVENING_END
        })
    }
    let newArr = [];
    for (var i = 0; i < arr.length; ++i) {
        for (var ix = 0; ix < arr[i].arr.length; ++ix) {
            newArr.push({
                ...arr[i].arr[ix],
                period: arr[i].type
            })
        }
    }
    return newArr;
}

function sendMedicalNotificationsAdmin(callback) {
    getGroups(function (err, groups) {
        if (err) {
            callback(err);
        } else {
            getDependentsRxs(groups, function (err, meds) {
                if (err) {
                    callback(err);
                } else {
                    let activeArr = getActiveMedsForPrevPeriods(meds.activeArr);
                    if (activeArr.length > 0) {
                        activeArr.forEach((active, index) => {
                            let body = {
                                type: "missed medication",
                                medicationMissed: {
                                    period: active.period,
                                    dependent: active.dependent,
                                    rxsMedication: active.rxsMedication,
                                    group: active.group
                                }
                            }
                            createAdminNotification(body, function (err, res) {
                                if (err) {
                                    callback(err);
                                } else if(index == activeArr.length-1){
                                    callback(null,"done")
                                }
                            });
                        });
                    } else {
                        callback(null, "done")
                    }
                }
            });
        }
    });
}

module.exports = { sendMedicalNotificationsAdmin }