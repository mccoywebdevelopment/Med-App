const { getPeriods, isBetween, formatAMPM } = require('../config/globalHelpers');
let { getCurrentTime } = require('../config/rootHelpers');
const GroupModel = require('../models/group/Group');
const UserModel = require('../models/user/User');
let currentTime = getCurrentTime();
let { morningEnd, afternoonEnd, eveningEnd } = getPeriods(currentTime);

function addDay(currentTime) {
    return (currentTime.getDate() + 1);
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getGroups(callback){
    GroupModel.find({}).populate('guardians').populate('dependents').exec(function (err, groups) {
        if (err) {
            callback(err);
        } else {
            UserModel.populate(groups, { path: "guardians.user" }, function (err, groups) {
                if (err) {
                    callback(err);
                } else {
                    callback(null,groups);
                }
            });
        }
    });
}

function getSeconds(currentTime,additional) {
    // let diff = minutesBefore; //20 minutes so twenty minutes before end

    let beforeEndMorning = new Date(morningEnd.getTime() + additional);
    let beforeEndAfternoon = new Date(afternoonEnd.getTime() + additional);
    // let beforeEndAfternoon = new Date(afternoonEnd.getTime() - diff * 60000);
    let beforeEndEvening = new Date(eveningEnd.getTime() + additional);

    let diffMorning = beforeEndMorning.getTime() - currentTime.getTime();
    let diffAfternoon = beforeEndAfternoon.getTime() - currentTime.getTime();
    let diffEvening = beforeEndEvening.getTime() - currentTime.getTime();

    return [diffMorning, diffAfternoon, diffEvening]
}

module.exports = { getGroups, capitalizeFirstLetter, isDuplicate, addDay, getSeconds }