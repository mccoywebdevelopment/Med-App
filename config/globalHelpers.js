const JWT_KEY = require('../config/configVars').JWT_KEY;
const jwt = require('jsonwebtoken');
const User = require('../models/user/User');

function verifyUser(req,res,next){
    var todayDate = new Date();
    var token = req.params.JWT;
    if(typeof(token)=='undefined' || !token){
        token = req.body.JWT;
    }
    if(!token){
        next({error:"Token is undefined."});
    }else{
        User.findOne({"auth.token":token},function(err,userFound){
            if(err){
                next({error:err});
            }else if(!userFound){
                next({error:"User not found."});
            }else if(!userFound.auth.isVerified){
                next({error:"User is not verified"});
            }else if(todayDate>userFound.auth.expiresIn){
                next({error:"Token expired"})
            }else{
                next();
            }
        });
    }
}
function verifyAdmin(req,res,next){
    var todayDate = new Date();
    var token = req.params.JWT;
    if(typeof(token)=='undefined' || !token){
        token = req.body.JWT;
    }
    if(!token){
        next({error:"Token is undefined."});
    }else{
        User.findOne({"auth.token":token},function(err,userFound){
            if(err){
                next({error:err});
            }else if(!userFound){
                next({error:"User not found."});
            }else if(!userFound.auth.isVerified){
                next({error:"User is not verified"});
            }else if(!userFound.isAdmin){
                next({error:"User does not have admin rights."})
            }else if(todayDate>userFound.auth.expiresIn){
                next({error:"Token expired"})
            }else{
                next();
            }
        });
    }
}
function findUserByJwt(jwt,callback){
    User.findOne({'auth.token':jwt},function(err,userFound){
        if(err){
          callback(err);
        }else if(!userFound){
          callback("user not found");
        }else{
          callback(null,userFound);
        }
      });
}
module.exports = {verifyUser,verifyAdmin,findUserByJwt};