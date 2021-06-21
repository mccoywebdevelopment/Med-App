let { getPeriods, isGreatorThan } = require('../config/globalHelpers');
let { getCurrentTime } = require('../config/rootHelpers');
let { getGroups } = require('./shared');
let createAdminNotification = require('../queries/notifications').create;
let { getDependentsRxs } = require('../queries/user');

function getActiveMedsForPrevPeriods(activeArr) {
    let { morningEnd, afternoonEnd, eveningEnd } = getPeriods(getCurrentTime());
    let arr = [];
    /*
    Need to loop through and check if 
    */
    if (isGreatorThan(morningEnd) && activeArr.morningMedsActive.length > 0) {
        arr.push({
            type: 'morning',
            arr: activeArr.morningMedsActive,
            periodEnd: morningEnd.format('hh:mm A')
        })
    }
    if (isGreatorThan(afternoonEnd) && activeArr.afternoonMedsActive.length > 0) {
        arr.push({
            type: 'afternoon',
            arr: activeArr.afternoonMedsActive,
            periodEnd: afternoonEnd.format('hh:mm A')
        })
    }
    if (isGreatorThan(eveningEnd) && activeArr.eveningMedsActive.length > 0) {
        arr.push({
            type: 'evening',
            arr: activeArr.eveningMedsActive,
            periodEnd: eveningEnd.format('hh:mm A')
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