//getDatesOfMeds
const findUser = require('../config/globalHelpers').findUserByJwt;
const MedicationEvent = require('../models/medicationEvent/MedicationEvent');
const Guardian = require('../models/guardian/Guardian');
const Group = require('../models/group/Group');
const RxsMedication = require('../models/rxsMedication/RxsMedication');
const Rxs = require('../models/rxs/Rxs');
const Event = require('../models/event/Event');
function getDatesOfMeds(jwt,callback){
    findUser(jwt,function(err,userFound){
        if(err){
            callback(err);
        }else{
            if(userFound.isAdmin){
                getAllMedEvents(function(err,result){
                    if(err){
                        callback(err);
                    }else{
                        callback(null,result);
                    }
                });
            }else{
                getSpecficEvents(userFound,function(err,result){
                    if(err){
                        callback(err);
                    }else{
                        callback(null,result);
                    }
                });
            }
        }
    });
}
function getAllMedEvents(callback){
    Group.find({}).populate('guardians').populate('dependents').exec(function(err,groupsFound){
        if(err){
          callback(err);
        }else if(!groupsFound){
          callback("No groups listed");
        }else{
          Rxs.populate(groupsFound,{path:"dependents.rxs"},function(err,res){
            if(err){
               callback(err);
            }else{
                RxsMedication.populate(res,{path:"dependents.rxs.rxsMedications"},function(err,res){
                    if(err){
                        callback(err);
                    }else{
                        MedicationEvent.populate(res,{path:'dependents.rxs.rxsMedications.events'},function(err,res){
                            if(err){
                                callback(err);
                            }else{
                                Guardian.populate(res,{path:'dependents.rxs.rxsMedications.events.createdBy'},function(err,res){
                                    Event.populate(res,{path:'dependents.rxs.rxsMedications.events.event'},function(err,res){
                                        if(err){
                                            callback(err);
                                        }else{
                                            res = filterMedEvents(res);
                                            callback(null,res);
                                        }
                                    });
                                });
                            }
                        });
                    }
                })
            }
          })
        }
    });
}
function getSpecficEvents(user,callback){
    getMedEventsByUser(user,function(err,medEvents){
        if(err){
            callback(err);
        }else{
            callback(null,medEvents);
        }
    });
}
function getMedEventsByUser(user,callback){
    Guardian.findOne({user:user},function(err,guardian){
        if(err){
            callback(err);
        }else if(!guardian){
            callback("Guardian not found.");
        }else{
            Group.find({guardians:guardian._id}).populate('guardians').populate('dependents').exec(function(err,groupsFound){
                if(err){
                  callback(err);
                }else if(!groupsFound){
                  callback("No groups listed");
                }else{
                  Rxs.populate(groupsFound,{path:"dependents.rxs"},function(err,res){
                    if(err){
                       callback(err);
                    }else{
                        RxsMedication.populate(res,{path:"dependents.rxs.rxsMedications"},function(err,res){
                            if(err){
                                callback(err);
                            }else{
                                MedicationEvent.populate(res,{path:'dependents.rxs.rxsMedications.events'},function(err,res){
                                    if(err){
                                        callback(err);
                                    }else{
                                        Event.populate(res,{path:'dependents.rxs.rxsMedications.events.event'},function(err,res){
                                            if(err){
                                                callback(err);
                                            }else{
                                                res = filterMedEvents(res);
                                                callback(null,res);
                                            }
                                        });
                                    }
                                });
                            }
                        })
                    }
                  })
                }
            });
        }
    });
}
function filterMedEvents(groups){
    var eventArr = [];
    for(var i=0;i<groups.length;++i){
        var dependents = groups[i].dependents;
        for(var ix=0;ix<dependents.length;++ix){
            var rxs = dependents[ix].rxs;
            for(var ixx=0;ixx<rxs.length;++ixx){
                var rxsMedications = rxs[ixx].rxsMedications;
                for(var j=0;j<rxsMedications.length;++j){
                    var events = rxsMedications[j].events;
                    for(var z=0;z<events.length;++z){
                        var obj = {
                            dependent:dependents[ix],
                            rxs:rxs[ixx],
                            rxsMedication:rxsMedications[j],
                            event:events[z]
                        }
                        eventArr.push(obj);
                    }
                }
            }
        }
    }
    return eventArr;

}

module.exports = {getDatesOfMeds};