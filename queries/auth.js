const User = require('../models/user/User');
const crypto = require('crypto');
const createGuardian = require('./guardian').create;

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
                            var redirect = "/user/dashboard";
                            if(userFound.isAdmin){
                                redirect = "/admin/users";
                            }
                            var obj = {
                                JWT:token,
                                redirectURL:redirect
                            }
                            if(!userSaved.isAdmin){
                                body.user = userSaved._id.toString();
                                createGuardian(body,function(err,guardianCreated){
                                    if(err){
                                        callback(err);
                                    }else{
                                        callback(null,obj);
                                    }
                                });
                            }else{
                                callback(null,obj);
                            }
                           
                        }
                    });
                }
            });
        }
    });
}
function setExpireToken(userFound){
    var today = new Date();
    today.setHours(today.getHours() + 4);

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
    User.findOne({username:body.username},function(err,userFound){
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
                                    var redirect = "/user/dashboard";
                                    if(userFound.isAdmin){
                                        redirect = "/admin/users";
                                    }
                                    var obj = {
                                        JWT:token,
                                        redirectURL:redirect
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
function resetUserPassword(body,callback){
    if(!body.email || !body.password){
        callback("Missing one of the following required fields: email, token, and password.")
    }else{
        User.findOne({username:body.email},function(err,userFound){
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
                                    var redirect = "/user/dashboard";
                                    if(userFound.isAdmin){
                                        redirect = "/admin/users";
                                    }
                                    var obj = {
                                        JWT:token,
                                        redirectURL:redirect
                                    }
                                    callback(null,obj);
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



module.exports={registerUser,logginUser,signToken,resetUserPassword,logoutUser};