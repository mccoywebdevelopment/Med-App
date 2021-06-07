let express = require('express');

let router = express.Router();
let authQ = require('../queries/auth');
let CLIENT_URL = process.env.CLIENT_URL || require('../config/configVars').CLIENT_URL

router.route("/register/:email/:token")
.post(function(req,res){
    authQ.registerUser(req.body,req.params.token,req.params.email,function(err,result){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.send({"result":result});
        }
    });
});

router.route("/login")
.post(function(req,res){
    authQ.logginUser(req.body,function(err,result){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.send({"result":result});
        }
    });
});

router.route("/reset-password/:JWT")
.post(function(req,res){
    authQ.resetUserPassword(req.body,function(err,result){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.send({"result":result});
        }
    });
});

router.route("/logout/:token")
.get(function(req,res){
    authQ.logoutUser(req.params.token,function(err,result){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.redirect(CLIENT_URL +'/auth/login');
        }
    });
});

router.route("/delete-account/:token")
.post(function(req,res){
    authQ.deleteAccount(req.params.token,function(err,result){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.send({"result":result});
        }
    });
});



module.exports = router;