let CronJob = require('cron').CronJob;
let { getCurrentTime } = require('./config/rootHelpers');
const { getPeriods, formatAMPM } = require('./config/globalHelpers');
let currentTime = getCurrentTime();
let TIME_ZONE = process.env.TIME_ZONE || require('./config/configVars').TIME_ZONE;
let { morningEnd, afternoonEnd, eveningEnd } = getPeriods(currentTime);
const sendMedicalNotificationsEmail = require('./notifications/UserReminder').sendMedicalNotificationsEmail;
const sendMedicalNotificationsAdmin = require('./notifications/AdminMedEvents').sendMedicalNotificationsAdmin;
let MONGO_URI = process.env.MONGODB_URI || require('./config/configVars').MONGODB_URI;
let mongoose = require('mongoose');

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) throw err;
});

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

sendMedicalNotificationsEmail(function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("User morning notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
    }
});

let morningHour = morningEnd.format('H');
new CronJob("00 39 " + morningHour + " * * 0-6", function () {
    console.log("User morning notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsEmail(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("User morning notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

let afternoonHour = afternoonEnd.format('H');
new CronJob("00 39 " + afternoonHour + " * * 0-6", function () {
    console.log("User afternoon notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsEmail(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("User afternoon notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

let eveningHour = eveningEnd.format('H');
new CronJob("00 39 " + eveningHour + " * * 0-6", function () {
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

morningHour = Number(morningEnd.format('H')) + 1;
new CronJob("00 02 " + morningHour + " * * 0-6", function () {
    console.log("Admin morning notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsAdmin(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Admin morning notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

afternoonHour = Number(afternoonEnd.format('H')) + 1;
new CronJob("00 02 " + afternoonHour + " * * 0-6", function () {
    console.log("Admin afternoon notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsAdmin(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Admin afternoon notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);

eveningHour = Number(eveningEnd.format('H')) + 1;
new CronJob("00 02 " + eveningHour + " * * 0-6", function () {
    console.log("Admin evening notification triggered @ " + formatAMPM(getCurrentTime()) + " today.");
    sendMedicalNotificationsAdmin(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Admin evening notification sent @ " + formatAMPM(getCurrentTime()) + " today.");
        }
    });
}, undefined, true, TIME_ZONE);
