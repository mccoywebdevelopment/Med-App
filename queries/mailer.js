const BASE_URL = process.env.BASE_URL || require('../config/configVars').BASE_URL;
const CLIENT_URL = process.env.CLIENT_URL || require('../config/configVars').CLIENT_URL;
const EMAIL = process.env.EMAIL || require('../config/configVars').EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || require('../config/configVars').EMAIL_PASSWORD;
const fs = require("fs");
const nodemailer = require("nodemailer");
const User = require('../models/user/User');
const crypto = require('crypto');

function authenticateUserEmail(email,token,callback){
  User.findOne({username:email},function(err,userFound){
    if(err){
      callback(err);
    }else if(!userFound){
      callback("User with the username/email: "+email+" does not exist.");
    }else if(token==userFound.auth.token){
      userFound.auth.isVerified = true;
      userFound.save(function(err,userSaved){
        if(err){
          callback(err);
        }else{
          callback(null,token);
        }
      });
    }else{
      generateToken(email,function(err,newToken){
        if(err){
          callback(err);
        }else{
          callback(null,null);
        }
      });
    }
  });
}
function readHTMLFile(path,email,redirectUrl,emailToken,callback) {
    fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
      if (err) {
        callback(err);
      } else {
        var token = "";
        if(emailToken){
          token = "/"+emailToken;
        }
        html = html.replace("USERNAME",email);
        callback(null, html);
      }
    });
  
  };
  function generateToken(email,callback){
    User.findOne({username:email},function(err,UserFound){
      if(err){
        callback(err);
      }else if(!UserFound){
        callback("User with the username/email: "+email+" does not exist.");
      }else{
        var token = crypto.randomBytes(64).toString('hex');
        UserFound.auth.token = token;
        UserFound.save(function(err,userSaved){
          if(err){
            callback(err);
          }else{
            callback(null,token);
          }
        });
      }
    });
  }
  function sendMail(subject,messageText,buttonText,email,emailToken,templatePath,redirectUrl,callback){
    generateToken(email,function(err,token){
      if(err){
          callback(err);
      }
      else{
        if(emailToken){
          emailToken = token;
        }

        readHTMLFile(templatePath,email,redirectUrl,emailToken,function(err,html){
            if(err){
                callback(err);
            }else{
                var token = "";
                if(emailToken){
                    token = emailToken;
                }
                html = html.replace("MSG",messageText);
                html = html.replace("BTN_TEXT",buttonText);
                if(redirectUrl == "api/auth/email/redirect"){
                  html = html.replace("URL",BASE_URL+"/"+redirectUrl+"/"+email+"/"+token);
                  html = html +"<h1>If button doesn't works please follow this link:"+ 
                  BASE_URL+"/"+redirectUrl+"/"+email+"/"+token + "</h1>";
                }else{
                  html = html.replace("URL",CLIENT_URL+"/auth/reset-password/"+email+"/"+token);
                  html = html +"<h1>If button doesn't works please follow this link:"+ 
                  CLIENT_URL+"/auth/reset-password/"+email+"/"+token + "</h1>";
                }
                // html = html.replace("URL",CLIENT_URL+"/auth/reset-password/"+email+"/"+token);
                // html = html +"<h1>If button doesn't works please follow this link:"+ 
                // CLIENT_URL+"/auth/reset-password/"+email+"/"+token + "</h1>";
                
                sendNodeMail(html,email,subject,function(err,result){
                    if(err){
                        callback(err);
                    }else{
                        callback(null,result);
                    }
                });
            }
        });
      }
    });
  }

  function sendNodeMail(html,email,subject,callback){
    nodemailer.createTestAccount((err, account) => {
        if (err) {
          console.error("Failed to create a testing account. " + err.message);
          callback(err);
        }
        console.log(EMAIL);
        console.log(EMAIL_PASSWORD);
        const transporter = nodemailer.createTransport({
          service: "AOL",
          auth: {
            user: EMAIL,
            pass: EMAIL_PASSWORD
          }
        });
  
        let message = {
          from: "Sun Notes <" + EMAIL + ">",
          to: email,
          subject: subject,
          html: html
        };
  
        transporter.sendMail(message, (err, info) => {
          if (err) {
            callback(err);
          } else {
            callback(null, "Email was sent please check your inbox.");
          }
        });
      });
}

module.exports = {sendMail,authenticateUserEmail};