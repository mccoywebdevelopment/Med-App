let { getCurrentTime } = require('../config/rootHelpers');
const GroupModel = require('../models/group/Group');
const UserModel = require('../models/user/User');

function addDay(currentTime) {
    return (currentTime.format('D') + 1);
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


module.exports = { getGroups, capitalizeFirstLetter, isDuplicate, addDay}