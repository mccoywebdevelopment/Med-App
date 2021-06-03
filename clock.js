let CronJob = require('cron').CronJob;
let { getCurrentTime } = require('./config/rootHelpers');
const { getPeriods, isBetween, formatAMPM } = require('./config/globalHelpers');
let currentTime = getCurrentTime();
let TIME_ZONE = process.env.TIME_ZONE || require('./config/configVars').TIME_ZONE;
let { morningEnd, afternoonEnd, eveningEnd } = getPeriods(currentTime);
let minutesBefore = process.env.MINUTES_BEFORE || require('./config/configVars').MINUTES_BEFORE;
const sendMedicalNotificationsEmail  = require('./notifications/UserReminder').sendMedicalNotificationsEmail;
const sendMedicalNotificationsAdmin = require('./notifications/AdminMedEvents').sendMedicalNotificationsAdmin;

/*
# ┌────────────── second (optional)
# │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
*/

/*
user notifications
*/

let morningHour = morningEnd.getHours();
new CronJob("* 39 " + morningHour + " * * 0-6", function () {
    console.log("User morning notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsEmail(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("User morning notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

let afternoonHour = afternoonEnd.getHours();
new CronJob("* 39 " + afternoonHour + " * * 0-6", function () {
    console.log("User afternoon notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsEmail(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("User afternoon notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

let eveningHour = eveningEnd.getHours();
new CronJob("* 39 " + eveningHour + " * * 0-6", function () {
    console.log("User evening notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsEmail(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("User evening notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

/*
admin notifications
*/

morningHour = morningEnd.getHours() + 1;
new CronJob("* 2 " + morningHour + " * * 0-6", function () {
    console.log("Admin morning notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsAdmin(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Admin morning notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

afternoonHour = afternoonEnd.getHours() + 1;
new CronJob("* 2 " + afternoonHour + " * * 0-6", function () {
    console.log("Admin afternoon notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsAdmin(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Admin afternoon notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

eveningHour = eveningEnd.getHours() + 1;
new CronJob("* 2 " + eveningHour + " * * 0-6", function () {
    console.log("Admin evening notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsAdmin(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Admin evening notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);
