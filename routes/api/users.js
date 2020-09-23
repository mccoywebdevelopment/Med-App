const express = require('express');
const errors = require('../errors');
const userQ = require('../../queries/user');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const verifyUser = require('../../config/globalHelpers').verifyUser;
const router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    userQ.findExceptMe(req.params.JWT,function(error,allDependents){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.json(allDependents);
        }
    })
})
.post(verifyAdmin,function(req,res){
    userQ.create(req.body,function(error,result){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(result);
        }
    });
});

router.route("/:id/:JWT")
.get(verifyAdmin,function(req,res){
    userQ.findById(req.params.id,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
})
.patch(verifyAdmin,function(req,res){
    var obj = req.body;
    console.log(obj)
    userQ.patchUpdateById(obj,req.params.id,function(err,updatedObj){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            updatedObj._id = req.params.id;
            res.send(updatedObj);
        }
    });
})
.delete(verifyAdmin,function(req,res){
    userQ.deleteById(req.params.id,function(err,deletedDoc){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(deletedDoc);
        }
    });
});

router.route('/get/dependents/:JWT')
.get(verifyUser,function(req,res){
    userQ.getDependents(req.params.JWT,function(err,result){
        if(err){
            console.log(err);
            res.json({error:err});
        }else{
            res.send(result);
        }
    });
});

router.route('/create-first-user/:secretKey/:username/:password')
.get(function(req,res){
    userQ.createFirstUser(req.params.secretKey,req.params.username,req.params.password,function(err,result){
        if(err){
            console.log(err);
            res.json({error:err});
        }else{
            res.send(result);
        }
    });
});



module.exports = router;

