let Dependent = require('../models/dependent/Dependent');
let User = require('../models/user/User');
let RxsMedications = require('../models/rxsMedication/RxsMedication');
let Group = require('../models/group/Group');
let { getCurrentTime } = require('../config/rootHelpers');

function getAll(jwt,callback){
    getNumberOfDependents(function(err,totalDep){
        if(err){
            callback(err);
        }else{
            getNumberOfRxsMedications(function(err,rxsMed){
                if(err){
                    callback(err);
                }else{
                    User.find({},function(err,users){
                        if(err){
                            callback(err);
                        }else{
                            Group.find({}).populate('guardians').populate('dependents').exec(function(err,groups){
                                if(err){
                                    callback(err);
                                }else{
                                    var obj = {
                                        dependents:{
                                            total:totalDep.length,
                                            avgRxsMeds:getAvgRxsMedsOfDep(rxsMed.length,totalDep.length),
                                            avgAge:getAvgAgeOfDep(totalDep)
                                        },
                                        users:{
                                            total:users.length,
                                            lastUserLoggon:getLastUserLoggonAndNumberOfAdmins(jwt,users).lastUser,
                                            numOfAdmins:getLastUserLoggonAndNumberOfAdmins(jwt,users).numOfAdmins
                                        },
                                        groups:{
                                            total:groups.length,
                                            guardToDep:getGuardianToDepRation(groups),
                                            groupWithMostDep:groupWithTheMostDep(groups).name
                                        }
                                    }
                                    callback(null,obj);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
function groupWithTheMostDep(groups){
    if(groups.length<1){
        return "N/A"
    }
    var top = groups[0];
    for(var i=1;i<groups.length;++i){
        if(groups[i].dependents.length>top.dependents.length){
            top = groups[i];
        }
    }
    return top;
}
function reduce(numerator,denominator){
    var gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
  }
function getGuardianToDepRation(groups){
    var guardians = 0;
    var dependents = 0;
    for(var i=0;i<groups.length;++i){
        dependents = dependents + groups[i].dependents.length;
        guardians = guardians + groups[i].guardians.length;
    }
    var obj = reduce(guardians,dependents);
    guardians = obj[0];
    dependents = obj[1];
    return (guardians + ":" + dependents);
}
function getLastUserLoggonAndNumberOfAdmins(jwt,users){
    var lastUser = null;
    var admins = 0;
    for(var i=0;i<users.length;++i){
        if(users[i].isAdmin){
            admins++;
        }
        if(typeof(users[i].lastLoggon)!='undefined' && users[i].auth.token!=jwt){
            if(lastUser==null){
                lastUser = users[i];
            }else if(lastUser[i].lastLoggon<users[i].lastLoggon){
                lastUser = users[i].lastLoggon;
            }
        }
    }
    if(lastUser != null){
        lastUser = {
            username:lastUser.username,
            lastLoggon:lastUser.lastLoggon
        }
    }
    var obj ={
        numOfAdmins:admins,
        lastUser:lastUser
    }
    return obj;
}
function getNumberOfDependents(callback){
    Dependent.find({},function(err,dependents){
        if(err){
            callback(err);
        }else{
            callback(null,dependents);
        }
    });
}
function getAvgRxsMedsOfDep(rxsLen,depLen){
    if(depLen == 0){
        return 0;
    }else{
        return(Math.round(rxsLen/depLen * 100) / 100);
    }
}
function getAvgAgeOfDep(dependents){
    //1212-12-12
    var total = 0;
    if(dependents.length == 0){
        return total;
    }
    for(var i=0;i<dependents.length;++i){
        var year = new Date(dependents[i].dateOfBirth).getFullYear();
        var curYear = getCurrentTime().getFullYear();
        total = total + curYear - year;
    }
    return(Math.round(total/dependents.length * 100) / 100);
}
function getNumberOfRxsMedications(callback){
    RxsMedications.find({},function(err,rxsMedications){
        if(err){
            callback(err);
        }else{
            callback(null,rxsMedications);
        }
    });
}

module.exports = {getAll}