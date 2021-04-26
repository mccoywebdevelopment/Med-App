const { getPeriods, isBetween, formatAMPM } = require('../config/globalHelpers');
const GroupModel = require('../models/group/Group');
const UserModel = require('../models/user/User');
const path = require('path');
const { sendMail } = require('../queries/mailer');
const { getDependentsRxs } = require('../queries/user');
let currentTime = new Date();
const minutesBefore = process.env.MINUTES_BEFORE || require('../config/configVars').MINUTES_BEFORE;
const VALID_TIMES_MORNING_END = process.env.VALID_TIMES_MORNING_END || require('../config/configVars').VALID_TIMES_MORNING_END;
const VALID_TIMES_AFTERNOON_END = process.env.VALID_TIMES_AFTERNOON_END || require('../config/configVars').VALID_TIMES_AFTERNOON_END;
const VALID_TIMES_EVENING_END = process.env.VALID_TIMES_EVENING_END || require('../config/configVars').VALID_TIMES_EVENING_END;
const CLIENT_URL = process.env.CLIENT_URL || require('../config/configVars').CLIENT_URL;
const { getGroups, capitalizeFirstLetter, isDuplicate, addDay, getSeconds } = require('./shared');

function sendNotification(time, isLast) {
    setTimeout(function () {
        console.log("User notification triggered @ " + formatAMPM(new Date()) + " today.");
        sendMedicalNotificationsEmail(function (err) {
            if (err) {
                console.log(err);
            }
            if (isLast) {
                init();
            }
            console.log("User notification sent @ " + formatAMPM(new Date()) + " today.");
        });
    }, time)
}

function init() {
    let diffSec = minutesBefore * 60000 * -1;

    let seconds = getSeconds(currentTime, diffSec);
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
        msg: "You have the following: " + str + " due before " + periodEnd + " today.",
        btnTxt: "Open App",
        imagePath: path.join(__dirname, '..', '/config/email/medNotification/images/notify.png'),
        to: username,
        templatePath: path.join(__dirname, '..', '/config/email/medNotification/index.html'),
        redirectURL: CLIENT_URL + '/user/home'
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

function getActiveMedsForCurrentPeriod(activeArr) {
    let today = new Date();
    let { morningStart, morningEnd, afternoonStart, afternoonEnd, eveningStart, eveningEnd } =
        getPeriods(currentTime);

    if (isBetween(today, morningStart, morningEnd) && activeArr.morningMedsActive.length > 0) {
        return {
            type: 'morning',
            arr: activeArr.morningMedsActive,
            periodEnd: VALID_TIMES_MORNING_END
        }
    } else if (isBetween(today, afternoonStart, afternoonEnd) && activeArr.afternoonMedsActive.length > 0) {
        return {
            type: 'afternoon',
            arr: activeArr.afternoonMedsActive,
            periodEnd: VALID_TIMES_AFTERNOON_END
        }
    } else if (isBetween(today, eveningStart, eveningEnd) && activeArr.eveningMedsActive.length > 0) {
        return {
            type: 'evening',
            arr: activeArr.eveningMedsActive,
            periodEnd: VALID_TIMES_EVENING_END
        }
    } else {
        return null;
    }
}
function sendMedicalNotificationsEmail(callback) {
    getGroups(function (err, groups) {
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
                        callback(err);
                    } else {
                        let currentActive = getActiveMedsForCurrentPeriod(meds.activeArr);
                        if (currentActive && currentActive.arr.length > 0) {
                            sendMedNotificationEmail(user.username, currentActive.arr, currentActive.type, currentActive.periodEnd, function (err, res) {
                                if (err) {
                                    callback(err);
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

module.exports = { init }
