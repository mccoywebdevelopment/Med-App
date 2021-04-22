const { getPeriods, isBetween, formatAMPM } = require('../config/globalHelpers');
const GroupModel = require('../models/group/Group');
const UserModel = require('../models/user/User');
const path = require('path');
const { sendMail } = require('../queries/mailer');
const { getDependentsRxs } = require('../queries/user');
let currentTime = new Date();
const minutesBefore = process.env.MINUTES_BEFORE || require('../config/configVars').MINUTES_BEFORE;
const VALID_TIMES = process.env.VALID_TIMES || require('../config/configVars').VALID_TIMES;
const CLIENT_URL = process.env.CLIENT_URL || require('../config/configVars').CLIENT_URL;
let { morningEnd, afternoonEnd, eveningEnd } = getPeriods(currentTime);

function getSeconds(currentTime) {
    let diff = minutesBefore; //20 minutes so twenty minutes before end

    let beforeEndMorning = new Date(morningEnd.getTime() - diff * 60000);
    let beforeEndAfternoon = new Date(afternoonEnd.getTime() - diff * 60000);
    let beforeEndEvening = new Date(eveningEnd.getTime() - diff * 60000);

    let diffMorning = beforeEndMorning.getTime() - currentTime.getTime();
    let diffAfternoon = beforeEndAfternoon.getTime() - currentTime.getTime();
    let diffEvening = beforeEndEvening.getTime() - currentTime.getTime();

    return [diffMorning, diffAfternoon, diffEvening]
}

function sendNotification(time, isLast) {
    setTimeout(function () {
        console.log("Notification triggered @ " + formatAMPM(new Date()) + " today.");
        sendMedicalNotificationsEmail(function (err) {
            if (err) {
                console.log(err);
            }
            if (isLast) {
                init();
            }
            console.log("Notification sent @ " + formatAMPM(new Date()) + " today.");
        });
    }, time)
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addDay(currentTime) {
    return (currentTime.getDate() + 1);
}

function init() {
    let seconds = getSeconds(currentTime);
    let isTimeAhead = false;
    for (var i = 0; i < seconds.length; ++i) {
        if (seconds[i] > 0) {
            let isLast = false;
            if (i == seconds.length - 1) {
                isLast = true;
            }
            sendNotification(seconds[i], isLast);
            isTimeAhead = true;
        }
    }
    //Meaning time is after evening or before morning ends
    //need to get diff for time for tommorow
    if (!isTimeAhead) {
        currentTime = addDay(currentTime);
        init();
    }
}

function sendMedNotificationEmail(username, activeMedications, period, periodEnd, callback) {
    let str = "";
    for (let i = 0; i < activeMedications.length; ++i) {
        str = str + " " + activeMedications[i].rxsMedication.name;
        if (activeMedications[i + 1]) {
            str = str + ","
        }
    }
    let email = {
        subject: activeMedications.length + " Medication(s) Due This " + capitalizeFirstLetter(period),
        title: "Medication Reminder",
        msg: "You have the following: " + str + " due at before " + periodEnd + " today.",
        btnTxt: "Open App",
        imagePath: path.join(__dirname, '..', '/config/email/medNotification/images/notify.png'),
        to: username,
        templatePath: path.join(__dirname, '..', '/config/email/medNotification/index.html'),
        redirectURL:  CLIENT_URL +'/user/home'
    }

    sendMail(email.subject, email.title, email.msg, email.btnTxt,
        email.imagePath, email.to, email.isEmailToken, email.templatePath,
        email.redirectURL, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
}

function isDuplicate(objs, user) {
    for (let i = 0; objs.length; ++i) {
        if (objs[i].user == user) {
            return {
                value: true,
                index: i
            }
        }
    }
    return false;
}
function getActiveMedsForCurrentPeriod(activeArr) {
    let today = new Date();
    let { morningStart, morningEnd, afternoonStart, afternoonEnd, eveningStart, eveningEnd } =
        getPeriods(currentTime);

    if (isBetween(today, morningStart, morningEnd) && activeArr.morningMedsActive.length > 0) {
        return {
            type: 'morning',
            arr: activeArr.morningMedsActive,
            periodEnd: VALID_TIMES.morning[1]
        }
    } else if (isBetween(today, afternoonStart, afternoonEnd) && activeArr.afternoonMedsActive.length > 0) {
        return {
            type: 'afternoon',
            arr: activeArr.afternoonMedsActive,
            periodEnd: VALID_TIMES.afternoon[1]
        }
    } else if (isBetween(today, eveningStart, eveningEnd) && activeArr.eveningMedsActive.length > 0) {
        return {
            type: 'evening',
            arr: activeArr.eveningMedsActive,
            periodEnd: VALID_TIMES.evening[1]
        }
    } else {
        return null;
    }
}
function sendMedicalNotificationsEmail(callback) {
    GroupModel.find({}).populate('guardians').populate('dependents').exec(function (err, groups) {
        if (err) {
            callback(err);
        } else {
            UserModel.populate(groups, { path: "guardians.user" }, function (err, groups) {
                if (err) {
                    callback(err);
                } else {
                    let notifiedUsers = [];
                    for (i = 0; i < groups.length; ++i) {
                        for (var ix = 0; ix < groups[i].guardians.length; ++ix) {
                            if (groups[i].guardians[ix].user &&
                                groups[i].guardians[ix].user.notifications.type == 'email' &&
                                groups[i].guardians[ix].user.notifications.recieve) {
                                let duplicate = isDuplicate(notifiedUsers, groups[i].guardians[ix].user);
                                if (duplicate) {
                                    notifiedUsers[duplicate.index].groups.push(groups[i]);
                                } else {
                                    notifiedUsers.push({
                                        user: groups[i].guardians[ix].user,
                                        groups: [groups[i]]
                                    });
                                }
                            }
                        }
                    }
                    i = 0;
                    notifiedUsers.forEach((obj, index) => {
                        let user = obj.user;
                        let groups = obj.groups;
                        getDependentsRxs(groups, function (err, meds) {
                            if (err) {
                                console.log(err);
                            } else {
                                let currentActive = getActiveMedsForCurrentPeriod(meds.activeArr);
                                if (currentActive && currentActive.arr.length > 0) {
                                    sendMedNotificationEmail(user.username, currentActive.arr, currentActive.type, currentActive.periodEnd, function (err, res) {
                                        if (err) {
                                            console.log(err);
                                        } else if (i == notifiedUsers.length - 1) {
                                            callback(null, "done");
                                            return;
                                        }
                                        i++;
                                    });
                                } else {
                                    if (i == notifiedUsers.length - 1) {
                                        callback(null, 'done');
                                        return;
                                    }
                                    i++;
                                }
                            }
                        });
                    });
                }
            });
        }
    });
}

// sendMedicalNotificationsEmail(function (err, res) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// });

init();
