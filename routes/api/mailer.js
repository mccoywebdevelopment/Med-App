const express = require('express');
const router = express.Router();
const path = require('path');
const errors = require('../errors');
const mailQ = require('../../queries/mailer');
const configVars = require('../../config/configVars');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const createUser = require('../../queries/user').create;

router.route("/create-user/:JWT")
.post(verifyAdmin,function(req,res){
  createUser(req.body,function(err,userCreated){
    if(err){
      console.log(err);
      res.status(errors.code.BAD_REQUEST).json({error:err});
    }else{
      //res.redirect('/api/auth/email/send-welcome/'+userCreated.username+"/"+req.params.JWT);
      mailQ.sendMail("Welcome","Welcome to Sunshine Acres rxs database! Please register by clicking the link below.","Click To Register",userCreated.username,true,
      path.join(__dirname, '../..', '/config/email/emailTemplate/welcomeEmail.html'),"api/auth/email/redirect",function(err,result){
        if(err){
          console.log(err);
          res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
          res.send({result:result});
        }
      });
    }
  });
});


router.route("/send-welcome/:email/:JWT")
.get(verifyAdmin,function(req,res){
    mailQ.sendMail("Welcome","Welcome to Sunshine Acres rxs database! Please register by clicking the link below.","Click To Register",req.params.email,true,
    path.join(__dirname, '../..', '/config/email/emailTemplate/welcomeEmail.html'),"api/auth/email/redirect",function(err,result){
      if(err){
        console.log(err);
        res.status(errors.code.BAD_REQUEST).json({error:err});
      }else{
        res.json({result:result});
      }
    });
});

router.route("/redirect/:email/:token")
.get(function(req,res){
  mailQ.authenticateUserEmail(req.params.email,req.params.token,function(err,token){
    if(err){
      console.log(err);
      res.status(errors.code.BAD_REQUEST).json({error:err});
    }else if(!token){
      res.status(errors.code.BAD_REQUEST).json({error:"Invalid Token"});
    }else{
      res.writeHead(301,
        {Location: configVars.CLIENT_URL+'/auth/register/'+req.params.email+'/'+token}
      );
      res.end();
    }
  });
});

router.route("/forgot-password")
.post(function(req,res){
  mailQ.sendMail("Forgot Password","Forgot password? Please click the link below to set a new password.","Reset Password",req.body.email,true,
    path.join(__dirname, '../..', '/config/email/emailTemplate/welcomeEmail.html'),"auth/reset-password",function(err,result){
      if(err){
        console.log(err);
        res.status(errors.code.BAD_REQUEST).json({error:err});
      }else{
        res.json({result:result});
      }
    });
});

module.exports = router;