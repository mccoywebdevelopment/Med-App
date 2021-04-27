let express = require('express');
let errors = require('../errors');
let router = express.Router();
let eventQ = require('../../queries/event');
let verifyUser = require('../../config/globalHelpers').verifyUser;


router.route("/:JWT")
.get(verifyUser,function(req,res){
    eventQ.findAll(function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    })
})
.post(verifyUser,function(req,res){
    eventQ.create(req.body,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
});


module.exports = router;