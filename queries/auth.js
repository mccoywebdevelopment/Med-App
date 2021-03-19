const User = require('../models/user/User');
const crypto = require('crypto');
const createGuardian = require('./guardian').create;
const guardianModel = require('../models/guardian/Guardian');
const updateGuardian = require('./guardian').patchUpdateById;
const Guardian = require('../models/guardian/Guardian');
const { addDetailsToUser } = require('../config/globalHelpers');

function registerUser(body,token,email,callback){
    User.findOne({username:email},function(err,userFound){
        if(err){
            callback(err);
        }else if(!userFound.auth.isVerified){
            callback("User is not verified");
        }else if(!userFound){
            callback("User not found");
        }else if(token!=userFound.auth.token){
            callback("Invalid token");
        }else if(typeof(body.password)=='undefined' || body.password.length<8){
            callback("Must provide a valid password");
        }else{
            signToken(function(err,token){
                if(err){
                    callback(err);
                }else{
                    userFound = setExpireToken(userFound);
                    userFound.password = body.password;
                    userFound.auth.token = token;
                    userFound.auth.isVerified = true;
                    userFound.save(function(err,userSaved){
                        if(err){
                            callback(err);
                        }else{
                            var redirect = "/user/home";
                            if(userFound.isAdmin){
                                redirect = "/admin/dependents";
                            }
                            userFound.password = undefined;
                            body.user = userSaved._id.toString();
                            let guardianBody = {
                                firstName:body.firstName,
                                lastName:body.lastName,
                                phoneNumber:body.phoneNumber
                            }
                            guardianModel.findOne({user:body.user},function(err,guardianFound){
                                if(err){
                                    callback(err);
                                }else if(!guardianFound){
                                    guardianBody.user = userFound._id;
                                    createGuardian(guardianBody,function(err,guardianCreated){
                                        if(err){
                                            callback(err);
                                        }else{
                                            userFound = addDetailsToUser(guardianCreated,userFound);
                                            var obj = {
                                                JWT:token,
                                                redirectURL:redirect,
                                                user:userFound
                                            }
                                            callback(null,obj);
                                        }
                                    });
                                }else{
                                    guardianBody = {
                                        updatedFields:guardianBody
                                    }
                                    updateGuardian(guardianBody,guardianFound._id,function(err,updatedGuardian){
                                        if(err){
                                            callback(err);
                                        }else{
                                            userFound = addDetailsToUser(updatedGuardian,userFound);
                                            var obj = {
                                                JWT:token,
                                                redirectURL:redirect,
                                                user:userFound
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
    });
}
function setExpireToken(userFound){
    var today = new Date();
    today.setHours(today.getHours() + 48);

    userFound.auth.expiresIn = today;
    return userFound;
}
function signToken(callback){
    crypto.randomBytes(48, function(err, buffer) {
        if(err){
            callback(err);
        }else{
            var token = buffer.toString('hex');
            callback(null,token);
        }
    });
}
function logginUser(body,callback){
    User.findOne({username:body.username}).select('+password').exec((err,userFound)=>{
        if(err){
            callback(err);
        }else if(!userFound){
            callback("User not found.");
        }else if(userFound.auth.status.statusValue != "approved"){
            callback("Your account needs to be verified.");
        }else{
            userFound.comparePassword(body.password,function(err,isMatch){
                if(err){
                    callback(err);
                }else{
                    signToken(function(err,token){
                        if(err){
                            callback(err);
                        }else{
                            userFound = setExpireToken(userFound);
                            userFound.password = body.password;
                            userFound.auth.token = token;
                            userFound.lastLoggon = new Date();
                            userFound.save(function(err,userSaved){
                                if(err){
                                    callback(err);
                                }else{
                                    var redirect = "/user/home";
                                    if(userFound.isAdmin){
                                        redirect = "/admin/dependents";
                                    }
                                    userFound.password = undefined;
                                    guardianModel.findOne({user:userFound._id},function(err,guardianFound){
                                        if(err){
                                            callback(err);
                                        }else{
                                            userFound = addDetailsToUser(guardianFound,userFound);

                                            var obj = {
                                                JWT:token,
                                                redirectURL:redirect,
                                                user:userFound
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
    });
}

function resetUserPassword(body,callback){
    if(!body.email || !body.password){
        callback("Missing one of the following fields.")
    }else{
        User.findOne({username:body.email}).select('+password').exec((err,userFound)=>{
            if(err){
                callback(err);
            }else if(!userFound){
                callback("User not found.");
            }else{
                signToken(function(err,token){
                    if(err){
                        callback(err);
                    }else{
                            userFound = setExpireToken(userFound);
                            userFound.password = body.password;
                            userFound.auth.token = token;

                            userFound.save(function(err,userSaved){
                                if(err){
                                    callback(err);
                                }else{
                                    var redirect = "/user/dependents";
                                    if(userFound.isAdmin){
                                        redirect = "/admin/users";
                                    }
                                    userFound.password = undefined;
                                    guardianModel.findOne({user:userFound._id},function(err,guardianFound){
                                        if(err){
                                            callback(err);
                                        }else{
                                            userFound = addDetailsToUser(guardianFound,userFound);

                                            var obj = {
                                                JWT:token,
                                                redirectURL:redirect,
                                                user:userFound
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
}
function logoutUser(jwt,callback){
    User.findOne({'auth.token':jwt},function(err,userFound){
        if(err){
            callback(err);
        }else if(!userFound){
            callback("User not found.");
        }else{
            signToken(function(err,token){
                if(err){
                    callback(err);
                }else{
                        userFound = setExpireToken(userFound);
                        userFound.auth.token = token;

                        userFound.save(function(err,userSaved){
                            if(err){
                                callback(err);
                            }else{
                                callback(null,"User is signed out.");
                            }
                        });
                }
            });
        }
    });
}

function deleteAccount(jwt,callback){
    User.find({},function(err,users){
        if(err){
            callback(err);
        }else{
            let userFound = null;
            let numOfAdmins = 0;

            for(var i=0;i<users.length;++i){
                if(users[i].auth.token == jwt){
                    userFound = users[i];
                }else if(users[i].isAdmin){
                    numOfAdmins++;
                }
            }

            if(!userFound){
                callback("User not found.");
            }else{
                Guardian.findOne({user:userFound._id},function(err,guardianFound){
                    if(err){
                        callback(err);
                    }else if(!guardianFound){
                        callback('Guardian not found.');
                    }else{
                        guardianFound.remove(function(err,removed){
                            if(err){
                                callback(err);
                            }else{
                                userFound.remove(function(err,removed){
                                    if(err){
                                        callback(err);
                                    }else{
                                        callback(null,null);
                                    }
                                })
                            }
                        });
                    }
                });
            }
        }
    });
}


module.exports={registerUser,logginUser,signToken,resetUserPassword,logoutUser,deleteAccount};